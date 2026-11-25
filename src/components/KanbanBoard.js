import { useState } from 'react';
import { STATUSES, STATUS_KEY } from '../config';
import { checklistProgress, colorFor } from '../utils';
import { DeadlineChip } from './ApplicationCard';
import { Pin } from './Icons';

// Drag & drop uses the browser's native HTML5 API (no extra library to install).
// Touch screens don't support it, so every card also has a "Move to" dropdown.
export default function KanbanBoard({ applications, onMove, onOpen }) {
  const [dragId, setDragId] = useState(null);
  const [overCol, setOverCol] = useState(null);

  const drop = (e, status) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain') || dragId;
    setOverCol(null);
    setDragId(null);
    const app = applications.find((a) => a._id === id);
    if (app && app.status !== status) onMove(app, status);
  };

  return (
    <div className="kanban" aria-label="Pipeline board">
      {STATUSES.map((status) => {
        const list = applications.filter((a) => a.status === status);
        return (
          <section
            key={status}
            className={`kcol ${overCol === status ? 'over' : ''}`}
            onDragOver={(e) => {
              e.preventDefault();
              e.dataTransfer.dropEffect = 'move';
              if (overCol !== status) setOverCol(status);
            }}
            onDragLeave={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget)) setOverCol(null);
            }}
            onDrop={(e) => drop(e, status)}
          >
            <header className="kcol-head">
              <i className={`dot seg-${STATUS_KEY[status]}`} />
              <h3>{status}</h3>
              <span className="kcount">{list.length}</span>
            </header>

            <div className="kcol-body">
              {list.map((a) => {
                const prep = checklistProgress(a);
                return (
                  <article
                    key={a._id}
                    className={`kcard ${dragId === a._id ? 'dragging' : ''}`}
                    draggable
                    tabIndex={0}
                    onDragStart={(e) => {
                      e.dataTransfer.setData('text/plain', a._id);
                      e.dataTransfer.effectAllowed = 'move';
                      setDragId(a._id);
                    }}
                    onDragEnd={() => {
                      setDragId(null);
                      setOverCol(null);
                    }}
                    onClick={() => onOpen(a)}
                    onKeyDown={(e) => e.target === e.currentTarget && e.key === 'Enter' && onOpen(a)}
                  >
                    <div className="kcard-top">
                      <span className="company-badge sm" style={{ background: colorFor(a.company) }}>{a.company.charAt(0).toUpperCase()}</span>
                      <div className="card-title">
                        <h4>{a.company}</h4>
                        <p>{a.role}</p>
                      </div>
                    </div>
                    <div className="card-meta">
                      <span className="tag">{a.type}</span>
                      {a.location && <span className="meta"><Pin width={13} height={13} /> {a.location}</span>}
                    </div>
                    <DeadlineChip deadline={a.deadline} status={a.status} />
                    {prep.total > 0 && (
                      <div className="mini-progress" title={`Prep checklist ${prep.done}/${prep.total}`}>
                        <span><i style={{ width: `${prep.pct}%` }} /></span>
                        <small>{prep.done}/{prep.total}</small>
                      </div>
                    )}
                    <select
                      className="kmove"
                      value={a.status}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => onMove(a, e.target.value)}
                      aria-label={`Move ${a.company} to another stage`}
                    >
                      {STATUSES.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </article>
                );
              })}
              {list.length === 0 && <p className="kempty">Drop a card here</p>}
            </div>
          </section>
        );
      })}
    </div>
  );
}
