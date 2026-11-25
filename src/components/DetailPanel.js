import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { STATUSES, STATUS_KEY } from '../config';
import { useToast } from '../context/ToastContext';
import { STARTER_CHECKLIST } from '../data/starterChecklist';
import { getCompanyPrep } from '../data/companyPrep';
import { colorFor, checklistProgress, downloadIcs, formatDate, formatDateTime, googleCalendarUrl } from '../utils';
import { historyOf } from '../insightsLib';
import { DeadlineChip } from './ApplicationCard';
import { Calendar, Download, Book, Arrow } from './FeatureIcons';
import { Close, Edit, External, Plus, Trash } from './Icons';

// Your own notes for this application (the original PlaceTrack notes field), kept separate from prep material.
// Saved when you click outside the box. Remounted via `key` when the application changes.
function NotesBox({ app, onPatch }) {
  const toast = useToast();
  const [text, setText] = useState(app.notes || '');
  const save = async () => {
    if (text === (app.notes || '')) return;
    try {
      await onPatch(app._id, { notes: text });
      toast('Notes saved');
    } catch (err) {
      toast(err.message, 'error');
    }
  };
  return (
    <section className="dsec">
      <h3>My notes</h3>
      <textarea rows={4} value={text} onChange={(e) => setText(e.target.value)} onBlur={save} placeholder="Referral, recruiter name, topics to revise, interview feedback..." />
    </section>
  );
}

export default function DetailPanel({ app, onClose, onEdit, onDelete, onMove, onPatch }) {
  const toast = useToast();
  const [items, setItems] = useState(app.checklist || []);
  const [draft, setDraft] = useState('');
  const lastId = useRef(app._id);

  // Reset the checklist only when a different application is opened
  useEffect(() => {
    if (lastId.current !== app._id) {
      lastId.current = app._id;
      setItems(app.checklist || []);
      setDraft('');
    }
  }, [app]);

  useEffect(() => {
    // Esc closes the drawer, unless an edit/delete dialog is open on top of it
    const onKey = (e) => e.key === 'Escape' && !document.querySelector('.modal') && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const saveChecklist = async (next) => {
    const prev = items;
    setItems(next);
    try {
      await onPatch(app._id, { checklist: next });
    } catch (err) {
      setItems(prev);
      toast(err.message, 'error');
    }
  };

  const toggle = (i) => saveChecklist(items.map((it, idx) => (idx === i ? { ...it, done: !it.done } : it)));
  const remove = (i) => saveChecklist(items.filter((_, idx) => idx !== i));
  const add = (e) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    if (items.length >= 50) return toast('Checklist is limited to 50 items', 'error');
    setDraft('');
    saveChecklist([...items, { text: text.slice(0, 200), done: false }]);
  };
  const addStarter = () => saveChecklist(STARTER_CHECKLIST.map((text) => ({ text, done: false })));

  const prep = checklistProgress({ checklist: items });
  const gcal = googleCalendarUrl(app);
  const history = historyOf(app);
  const { entry, links } = getCompanyPrep(app.company, app.role);
  const quick = [...links.direct, ...links.search].slice(0, 3);

  return (
    <div className="overlay drawer-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <aside className="drawer" role="dialog" aria-modal="true" aria-label={`${app.company} details`}>
        <header className="drawer-head">
          <span className="company-badge" style={{ background: colorFor(app.company) }}>{app.company.charAt(0).toUpperCase()}</span>
          <div className="card-title">
            <h2>{app.company}</h2>
            <p className="muted">{app.role} · {app.type}{app.location ? ` · ${app.location}` : ''}</p>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Close"><Close /></button>
        </header>

        <div className="drawer-body">
          <div className="drawer-row">
            <select
              className={`status-select pill pill-${STATUS_KEY[app.status]}`}
              value={app.status}
              onChange={(e) => onMove(app, e.target.value)}
              aria-label="Change status"
            >
              {STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
            <DeadlineChip deadline={app.deadline} status={app.status} />
            {app.ctc && <span className="tag">{app.ctc}</span>}
            {app.link && (
              <a className="btn btn-outline btn-sm" href={app.link} target="_blank" rel="noreferrer"><External width={14} height={14} /> Job post</a>
            )}
          </div>

          <NotesBox key={`${app._id}-${app.updatedAt}`} app={app} onPatch={onPatch} />

          <section className="dsec">
            <h3><Calendar width={16} height={16} /> Deadline reminder</h3>
            {gcal ? (
              <>
                <p className="muted">{formatDate(app.deadline)}. Add it to your calendar so it pops up the day before.</p>
                <div className="drawer-row">
                  <a className="btn btn-primary btn-sm" href={gcal} target="_blank" rel="noreferrer"><Calendar width={14} height={14} /> Google Calendar</a>
                  <button className="btn btn-outline btn-sm" onClick={() => { downloadIcs(app); toast('Calendar file downloaded'); }}>
                    <Download width={14} height={14} /> Download .ics
                  </button>
                </div>
              </>
            ) : (
              <p className="muted">No deadline set. Edit this application and add a date to enable calendar reminders.</p>
            )}
          </section>

          <section className="dsec">
            <h3>Prep checklist {prep.total > 0 && <span className="muted">{prep.done}/{prep.total}</span>}</h3>
            {prep.total > 0 && <div className="progress"><i style={{ width: `${prep.pct}%` }} /></div>}
            {items.length === 0 && (
              <div className="starter">
                <p className="muted">Nothing here yet. Start with a ready-made list and edit it.</p>
                <button className="btn btn-outline btn-sm" onClick={addStarter}>Add starter checklist</button>
              </div>
            )}
            <ul className="checklist">
              {items.map((it, i) => (
                <li key={i} className={it.done ? 'done' : ''}>
                  <label>
                    <input type="checkbox" checked={it.done} onChange={() => toggle(i)} />
                    <span>{it.text}</span>
                  </label>
                  <button className="icon-btn sm danger" onClick={() => remove(i)} aria-label="Remove item"><Close width={14} height={14} /></button>
                </li>
              ))}
            </ul>
            <form className="add-item" onSubmit={add}>
              <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Add a prep task, e.g. Revise DP on trees" maxLength={200} />
              <button className="btn btn-primary btn-sm" disabled={!draft.trim()} aria-label="Add task"><Plus width={16} height={16} /></button>
            </form>
          </section>

          <section className="dsec">
            <h3><Book width={16} height={16} /> Prep material for {app.company}</h3>
            <p className="muted">{entry ? entry.blurb : 'No curated notes for this company yet. The full kit has the most commonly asked topics and free links.'}</p>
            <ul className="linklist">
              {quick.map((l) => (
                <li key={l.url}>
                  <a href={l.url} target="_blank" rel="noreferrer">{l.title}</a>
                  {l.note && <small>{l.note}</small>}
                </li>
              ))}
            </ul>
            <Link className="btn btn-ghost btn-sm" to={`/resources?company=${encodeURIComponent(app.company)}&role=${encodeURIComponent(app.role)}`}>
              Open full prep kit <Arrow width={14} height={14} />
            </Link>
          </section>

          <section className="dsec">
            <h3>Status timeline</h3>
            <ol className="timeline">
              {history.map((h, i) => {
                const prev = history[i - 1];
                const gap = prev ? Math.round((h.at - prev.at) / 86400000) : null;
                return (
                  <li key={i}>
                    <i className={`dot seg-${STATUS_KEY[h.status]}`} />
                    <div>
                      <b>{h.status}</b>
                      <small>{formatDateTime(h.at)}{gap !== null ? ` · after ${gap} day${gap === 1 ? '' : 's'}` : ''}</small>
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>

        </div>

        <footer className="drawer-foot">
          <button className="btn btn-outline" onClick={() => onEdit(app)}><Edit width={15} height={15} /> Edit</button>
          <button className="btn btn-ghost danger-text" onClick={() => onDelete(app)}><Trash width={15} height={15} /> Delete</button>
        </footer>
      </aside>
    </div>
  );
}
