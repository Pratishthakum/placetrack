import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { STATUSES } from '../config';
import { useAuth } from '../context/AuthContext';
import { useApplications } from '../context/ApplicationContext';
import { useToast } from '../context/ToastContext';
import { exportApplicationsCsv, greeting, openDeadlineDays } from '../utils';
import StatsBar from './StatsBar';
import ApplicationCard from './ApplicationCard';
import ApplicationModal from './ApplicationModal';
import ConfirmDialog from './ConfirmDialog';
import KanbanBoard from './KanbanBoard';
import DetailPanel from './DetailPanel';
import DeadlineStrip from './DeadlineStrip';
import { Columns, Rows, Download } from './FeatureIcons';
import { Plus, Search } from './Icons';

const SORTS = {
  recent: 'Recently updated',
  deadline: 'Deadline (soonest)',
  company: 'Company (A-Z)',
};
const VIEW_KEY = 'placetrack_view';

export default function Dashboard() {
  const { user } = useAuth();
  const toast = useToast();
  const { applications, loading, fetchApplications, addApplication, updateApplication, moveApplication, deleteApplication } = useApplications();
  const [params, setParams] = useSearchParams();

  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [sort, setSort] = useState('recent');
  const [view, setView] = useState(() => localStorage.getItem(VIEW_KEY) || 'board'); // 'board' | 'list'
  const [modal, setModal] = useState(null); // null | 'new' | application
  const [toDelete, setToDelete] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    fetchApplications().catch(() => toast('Could not load applications', 'error'));
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    localStorage.setItem(VIEW_KEY, view);
  }, [view]);

  // Insights "Open" buttons link here as /dashboard?open=<id>
  useEffect(() => {
    const id = params.get('open');
    if (id && applications.some((a) => a._id === id)) {
      setSelectedId(id);
      setParams({}, { replace: true });
    }
  }, [params, applications, setParams]);

  // Search + sort (used by both views)
  const searched = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = applications.filter((a) => !q || `${a.company} ${a.role} ${a.location}`.toLowerCase().includes(q));
    if (sort === 'recent') list = [...list].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    if (sort === 'company') list = [...list].sort((a, b) => a.company.localeCompare(b.company));
    if (sort === 'deadline') list = [...list].sort((a, b) => (openDeadlineDays(a) ?? 9999) - (openDeadlineDays(b) ?? 9999));
    return list;
  }, [applications, query, sort]);

  // The list view additionally filters by status chip
  const visible = useMemo(() => (filter === 'All' ? searched : searched.filter((a) => a.status === filter)), [searched, filter]);
  const shown = view === 'board' ? searched : visible;

  const urgent = applications.filter((a) => {
    const d = openDeadlineDays(a);
    return d !== null && d >= 0 && d <= 3;
  }).length;

  const selected = applications.find((a) => a._id === selectedId) || null;

  const save = async (data) => {
    if (modal === 'new') {
      await addApplication(data);
      toast('Application added');
    } else {
      await updateApplication(modal._id, data);
      toast('Application updated');
    }
    setModal(null);
  };

  const changeStatus = async (app, status) => {
    if (app.status === status) return;
    try {
      await moveApplication(app._id, status);
      toast(`${app.company} moved to ${status}`);
    } catch (err) {
      toast(err.message, 'error');
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteApplication(toDelete._id);
      if (toDelete._id === selectedId) setSelectedId(null);
      toast('Application deleted');
    } catch (err) {
      toast(err.message, 'error');
    }
    setToDelete(null);
  };

  const exportCsv = () => {
    if (shown.length === 0) return toast('Nothing to export yet', 'error');
    exportApplicationsCsv(shown);
    toast(`Exported ${shown.length} application${shown.length > 1 ? 's' : ''} to CSV`);
  };

  return (
    <main className="dash">
      <div className="dash-head">
        <div>
          <h1>{greeting()}, {user.name.split(' ')[0]} 👋</h1>
          <p className="muted">
            {urgent > 0
              ? `${urgent} deadline${urgent > 1 ? 's' : ''} coming up in the next 3 days.`
              : "Here's where your placement hunt stands."}
          </p>
        </div>
        <div className="head-actions">
          <div className="view-toggle" role="group" aria-label="View">
            <button className={view === 'board' ? 'active' : ''} onClick={() => setView('board')} aria-pressed={view === 'board'}><Columns width={16} height={16} /> Board</button>
            <button className={view === 'list' ? 'active' : ''} onClick={() => setView('list')} aria-pressed={view === 'list'}><Rows width={16} height={16} /> List</button>
          </div>
          <button className="btn btn-outline" onClick={exportCsv} title="Download the applications shown below as CSV"><Download width={16} height={16} /> <span className="hide-sm">Export CSV</span></button>
          <button className="btn btn-primary" onClick={() => setModal('new')}><Plus /> New application</button>
        </div>
      </div>

      <StatsBar applications={applications} />
      <DeadlineStrip applications={applications} onOpen={(a) => setSelectedId(a._id)} />

      <div className="toolbar">
        <label className="search">
          <Search />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search company, role or location" />
        </label>
        <select className="sort" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort">
          {Object.entries(SORTS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      {view === 'list' && (
        <div className="chips" role="tablist">
          {['All', ...STATUSES].map((s) => {
            const n = s === 'All' ? applications.length : applications.filter((a) => a.status === s).length;
            return (
              <button key={s} className={`chip ${filter === s ? 'active' : ''}`} onClick={() => setFilter(s)}>
                {s} <span>{n}</span>
              </button>
            );
          })}
        </div>
      )}

      {loading ? (
        <div className="page-loader"><div className="spinner" /></div>
      ) : applications.length === 0 || (view === 'list' && visible.length === 0) || (view === 'board' && searched.length === 0) ? (
        <div className="empty">
          <div className="empty-art">📋</div>
          <h3>{applications.length === 0 ? 'No applications yet' : 'Nothing matches your filters'}</h3>
          <p className="muted">
            {applications.length === 0
              ? 'Add the first company you are targeting and start building your pipeline.'
              : 'Try a different search or status.'}
          </p>
          {applications.length === 0 && (
            <button className="btn btn-primary" onClick={() => setModal('new')}><Plus /> Add your first application</button>
          )}
        </div>
      ) : view === 'board' ? (
        <KanbanBoard applications={searched} onMove={changeStatus} onOpen={(a) => setSelectedId(a._id)} />
      ) : (
        <div className="card-grid">
          {visible.map((a) => (
            <ApplicationCard key={a._id} app={a} onEdit={setModal} onDelete={setToDelete} onStatusChange={changeStatus} onOpen={(x) => setSelectedId(x._id)} />
          ))}
        </div>
      )}

      {selected && (
        <DetailPanel
          app={selected}
          onClose={() => setSelectedId(null)}
          onEdit={(a) => setModal(a)}
          onDelete={(a) => setToDelete(a)}
          onMove={changeStatus}
          onPatch={updateApplication}
        />
      )}
      {modal && <ApplicationModal initial={modal === 'new' ? null : modal} onClose={() => setModal(null)} onSave={save} />}
      {toDelete && (
        <ConfirmDialog
          title="Delete this application?"
          message={`${toDelete.company} - ${toDelete.role} will be removed permanently.`}
          onConfirm={confirmDelete}
          onCancel={() => setToDelete(null)}
        />
      )}
    </main>
  );
}
