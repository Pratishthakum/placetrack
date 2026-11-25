import { colorFor, formatDate, openDeadlineDays } from '../utils';
import { Calendar } from './FeatureIcons';

// Next 14 days of deadlines (plus anything overdue) for applications that are still open
export default function DeadlineStrip({ applications, onOpen }) {
  const items = applications
    .map((a) => ({ app: a, d: openDeadlineDays(a) }))
    .filter((x) => x.d !== null && x.d <= 14)
    .sort((a, b) => a.d - b.d);

  if (items.length === 0) return null;

  const label = (d) => (d < 0 ? `Overdue ${Math.abs(d)}d` : d === 0 ? 'Today' : d === 1 ? 'Tomorrow' : `In ${d} days`);
  const tone = (d) => (d < 0 ? 'late' : d <= 3 ? 'soon' : 'ok');

  return (
    <section className="dl-strip" aria-label="Upcoming deadlines">
      <div className="dl-head">
        <Calendar width={16} height={16} />
        <h2>Upcoming deadlines</h2>
        <span className="muted">next 14 days</span>
      </div>
      <div className="dl-list">
        {items.map(({ app, d }) => (
          <button key={app._id} className={`dl-item dl-${tone(d)}`} onClick={() => onOpen(app)}>
            <span className="company-badge sm" style={{ background: colorFor(app.company) }}>{app.company.charAt(0).toUpperCase()}</span>
            <span className="dl-text">
              <b>{app.company}</b>
              <small>{formatDate(app.deadline)} · {label(d)}</small>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
