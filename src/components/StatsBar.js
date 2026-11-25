import { STATUSES, STATUS_KEY } from '../config';

export default function StatsBar({ applications }) {
  const count = (s) => applications.filter((a) => a.status === s).length;
  const total = applications.length;
  const active = count('Applied') + count('Online Test') + count('Interview');

  const cards = [
    ['Total applications', total, 'all'],
    ['Active in pipeline', active, 'applied'],
    ['Interviews', count('Interview'), 'interview'],
    ['Offers', count('Offer'), 'offer'],
  ];

  return (
    <section>
      <div className="stats">
        {cards.map(([label, value, key]) => (
          <div className={`stat stat-${key}`} key={label}>
            <span className="stat-label">{label}</span>
            <span className="stat-value">{value}</span>
          </div>
        ))}
      </div>

      {total > 0 && (
        <div className="pipeline">
          <div className="pipeline-bar" role="img" aria-label="Pipeline breakdown">
            {STATUSES.map((s) =>
              count(s) ? <i key={s} className={`seg-${STATUS_KEY[s]}`} style={{ width: `${(count(s) / total) * 100}%` }} title={`${s}: ${count(s)}`} /> : null
            )}
          </div>
          <div className="pipeline-legend">
            {STATUSES.map((s) => (
              <span key={s}><i className={`dot seg-${STATUS_KEY[s]}`} />{s} <b>{count(s)}</b></span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
