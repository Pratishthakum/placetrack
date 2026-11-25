import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApplications } from '../context/ApplicationContext';
import { useToast } from '../context/ToastContext';
import { avgDaysToResponse, buildNudges, followUpEmail, funnelCounts, kpis, rejectedAt, weeklyActivity } from '../insightsLib';
import { Arrow, Copy, Spark } from './FeatureIcons';

const fmtWeek = (d) => d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
const pct = (v) => (v === null ? '-' : `${v}%`);
const LEVEL_LABEL = { high: 'Urgent', med: 'Soon', low: 'Nudge' };

export default function Insights() {
  const { user } = useAuth();
  const toast = useToast();
  const { applications, loading, fetchApplications } = useApplications();

  useEffect(() => {
    fetchApplications().catch(() => toast('Could not load applications', 'error'));
    // eslint-disable-next-line
  }, []);

  const funnel = useMemo(() => funnelCounts(applications), [applications]);
  const stats = useMemo(() => kpis(applications), [applications]);
  const avgDays = useMemo(() => avgDaysToResponse(applications), [applications]);
  const weeks = useMemo(() => weeklyActivity(applications, 8), [applications]);
  const rejected = useMemo(() => rejectedAt(applications), [applications]);
  const nudges = useMemo(() => buildNudges(applications), [applications]);
  const peak = Math.max(1, ...weeks.map((w) => Math.max(w.added, w.moved)));

  const copyEmail = async (app) => {
    try {
      await navigator.clipboard.writeText(followUpEmail(app, user.name));
      toast('Follow-up email copied');
    } catch {
      toast('Could not copy. Your browser blocked clipboard access.', 'error');
    }
  };

  if (loading) return <main className="dash"><div className="page-loader"><div className="spinner" /></div></main>;

  if (applications.length === 0)
    return (
      <main className="dash">
        <div className="empty">
          <div className="empty-art">📈</div>
          <h3>No data to analyse yet</h3>
          <p className="muted">Add a few applications and move them through the pipeline. Your funnel and weekly activity will show up here.</p>
          <Link className="btn btn-primary" to="/dashboard">Go to dashboard</Link>
        </div>
      </main>
    );

  return (
    <main className="dash insights">
      <div className="dash-head">
        <div>
          <h1>Insights</h1>
          <p className="muted">How your search is converting, and who to follow up with.</p>
        </div>
      </div>

      <div className="stats">
        <div className="stat stat-all"><span className="stat-label">Applied so far</span><span className="stat-value">{stats.applied}</span></div>
        <div className="stat stat-applied"><span className="stat-label">Response rate</span><span className="stat-value">{pct(stats.responseRate)}</span></div>
        <div className="stat stat-interview"><span className="stat-label">Interview rate</span><span className="stat-value">{pct(stats.interviewRate)}</span></div>
        <div className="stat stat-offer"><span className="stat-label">Offer rate</span><span className="stat-value">{pct(stats.offerRate)}</span></div>
      </div>
      <p className="muted kpi-note">
        Rates are out of applications you actually applied to.{avgDays !== null && ` Companies take about ${avgDays} day${avgDays === 1 ? '' : 's'} on average to reply.`}
      </p>

      <div className="insight-grid">
        <section className="panel">
          <h2>Application funnel</h2>
          <p className="muted">How many applications reached each stage.</p>
          <ul className="funnel">
            {funnel.map((r, i) => (
              <li key={r.stage}>
                <div className="funnel-label"><b>{r.stage}</b><span>{r.count}{r.conv !== null && <small> · {r.conv}% of previous</small>}</span></div>
                <div className="funnel-track"><i className={`f-${i}`} style={{ width: `${Math.max(r.pctOfTop, r.count ? 3 : 0)}%` }} /></div>
              </li>
            ))}
          </ul>
          {rejected.length > 0 && (
            <p className="muted funnel-note">
              Rejections happened at: {rejected.map(([stage, n]) => `${stage} (${n})`).join(', ')}.
            </p>
          )}
        </section>

        <section className="panel">
          <h2>Weekly activity</h2>
          <p className="muted">Last 8 weeks, Monday to Sunday.</p>
          <div className="bars" role="img" aria-label="Applications added and stage changes per week">
            {weeks.map((w) => (
              <div className="bar-col" key={w.start.toISOString()}>
                <div className="bar-pair">
                  <span className="bar b-added" style={{ height: `${(w.added / peak) * 100}%` }} title={`${w.added} added`}>{w.added > 0 && <em>{w.added}</em>}</span>
                  <span className="bar b-moved" style={{ height: `${(w.moved / peak) * 100}%` }} title={`${w.moved} stage changes`}>{w.moved > 0 && <em>{w.moved}</em>}</span>
                </div>
                <small>{fmtWeek(w.start)}</small>
              </div>
            ))}
          </div>
          <div className="legend"><span><i className="dot b-added" /> Added</span><span><i className="dot b-moved" /> Stage changes</span></div>
        </section>
      </div>

      <section className="panel">
        <h2><Spark width={18} height={18} /> Follow-up nudges</h2>
        {nudges.length === 0 ? (
          <p className="muted">All caught up. Nothing is waiting on you right now.</p>
        ) : (
          <ul className="nudges">
            {nudges.map((n) => (
              <li key={n.id} className={`nudge nudge-${n.level}`}>
                <span className="nudge-level">{LEVEL_LABEL[n.level]}</span>
                <div className="nudge-text">
                  <b>{n.app.company} <small>{n.app.role}</small></b>
                  <p>{n.text}</p>
                </div>
                <div className="nudge-actions">
                  {n.email && <button className="btn btn-outline btn-sm" onClick={() => copyEmail(n.app)}><Copy width={14} height={14} /> Copy email</button>}
                  <Link className="btn btn-ghost btn-sm" to={`/dashboard?open=${n.app._id}`}>Open <Arrow width={14} height={14} /></Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
