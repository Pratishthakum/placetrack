import { STATUSES, STATUS_KEY } from '../config';
import { colorFor, formatDate, openDeadlineDays } from '../utils';
import { Edit, Trash, External, Pin, Wallet, Clock } from './Icons';

// Exported so the Kanban board and the deadline strip can reuse it
export function DeadlineChip({ deadline, status }) {
  const d = openDeadlineDays({ deadline, status });
  if (d === null) return null;
  let label, cls;
  if (d < 0) { label = `Overdue · ${formatDate(deadline)}`; cls = 'late'; }
  else if (d === 0) { label = 'Due today'; cls = 'soon'; }
  else if (d <= 3) { label = `Due in ${d} day${d > 1 ? 's' : ''}`; cls = 'soon'; }
  else { label = `Due ${formatDate(deadline)}`; cls = 'ok'; }
  return <span className={`deadline deadline-${cls}`}><Clock width={13} height={13} /> {label}</span>;
}

export default function ApplicationCard({ app, onEdit, onDelete, onStatusChange, onOpen }) {
  const stop = (e) => e.stopPropagation(); // buttons inside the card must not open the detail panel
  return (
    <article
      className="card card-click"
      onClick={() => onOpen && onOpen(app)}
      onKeyDown={(e) => e.target === e.currentTarget && e.key === 'Enter' && onOpen && onOpen(app)}
      tabIndex={0}
    >
      <header className="card-top">
        <span className="company-badge" style={{ background: colorFor(app.company) }}>{app.company.charAt(0).toUpperCase()}</span>
        <div className="card-title">
          <h3>{app.company}</h3>
          <p>{app.role}</p>
        </div>
        <div className="card-actions" onClick={stop}>
          {app.link && (
            <a className="icon-btn sm" href={app.link} target="_blank" rel="noreferrer" aria-label="Open job post" title="Open job post"><External width={15} height={15} /></a>
          )}
          <button className="icon-btn sm" onClick={() => onEdit(app)} aria-label="Edit" title="Edit"><Edit width={15} height={15} /></button>
          <button className="icon-btn sm danger" onClick={() => onDelete(app)} aria-label="Delete" title="Delete"><Trash width={15} height={15} /></button>
        </div>
      </header>

      <div className="card-meta">
        <span className="tag">{app.type}</span>
        {app.location && <span className="meta"><Pin width={14} height={14} /> {app.location}</span>}
        {app.ctc && <span className="meta"><Wallet width={14} height={14} /> {app.ctc}</span>}
      </div>

      {app.notes && <p className="card-notes">{app.notes}</p>}

      <footer className="card-bottom">
        <select
          className={`status-select pill pill-${STATUS_KEY[app.status]}`}
          value={app.status}
          onChange={(e) => onStatusChange(app, e.target.value)}
          onClick={stop}
          aria-label="Change status"
        >
          {STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
        <DeadlineChip deadline={app.deadline} status={app.status} />
      </footer>
    </article>
  );
}
