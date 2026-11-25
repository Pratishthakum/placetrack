import { checklistProgress, daysSince, daysUntil, isClosed } from './utils';

const DAY = 86400000;
const RANK = { Wishlist: 0, Applied: 1, 'Online Test': 2, Interview: 3, Offer: 4 };
export const FUNNEL_STAGES = ['Applied', 'Online Test', 'Interview', 'Offer'];

// Status history; old records (before timeline existed) fall back to their current status
export const historyOf = (app) => {
  const t = (app.timeline || []).map((e) => ({ status: e.status, at: new Date(e.at) }));
  return t.length ? t : [{ status: app.status, at: new Date(app.createdAt) }];
};

const lastMoveAt = (app) => historyOf(app)[historyOf(app).length - 1].at;

// Furthest pipeline stage ever reached (0 = wishlist ... 4 = offer)
export function furthestRank(app) {
  let best = 0;
  [...historyOf(app).map((h) => h.status), app.status].forEach((s) => {
    if (RANK[s] !== undefined) best = Math.max(best, RANK[s]);
  });
  if (app.status === 'Rejected' && best < 1) best = 1; // you can only be rejected after applying
  return best;
}

export function funnelCounts(apps) {
  const rows = [{ stage: 'Tracked', count: apps.length }];
  FUNNEL_STAGES.forEach((stage) => {
    rows.push({ stage, count: apps.filter((a) => furthestRank(a) >= RANK[stage]).length });
  });
  return rows.map((r, i) => ({
    ...r,
    pctOfTop: apps.length ? (r.count / apps.length) * 100 : 0,
    conv: i === 0 || rows[i - 1].count === 0 ? null : Math.round((r.count / rows[i - 1].count) * 100),
  }));
}

export function kpis(apps) {
  const applied = apps.filter((a) => furthestRank(a) >= 1);
  const n = applied.length;
  const pct = (x) => (n ? Math.round((x / n) * 100) : null);
  const responded = applied.filter((a) => furthestRank(a) >= 2 || a.status === 'Rejected').length;
  return {
    applied: n,
    responseRate: pct(responded),
    interviewRate: pct(applied.filter((a) => furthestRank(a) >= 3).length),
    offerRate: pct(applied.filter((a) => furthestRank(a) >= 4).length),
  };
}

// Average days between "Applied" and the first reply (next stage or rejection)
export function avgDaysToResponse(apps) {
  const gaps = [];
  apps.forEach((a) => {
    const h = historyOf(a);
    const i = h.findIndex((e) => e.status === 'Applied');
    if (i === -1) return;
    const next = h.slice(i + 1).find((e) => e.status !== 'Applied' && e.status !== 'Wishlist');
    if (next) gaps.push((next.at - h[i].at) / DAY);
  });
  return gaps.length ? Math.round(gaps.reduce((s, g) => s + g, 0) / gaps.length) : null;
}

// Where rejections happen: the stage you were at just before "Rejected"
export function rejectedAt(apps) {
  const out = {};
  apps
    .filter((a) => a.status === 'Rejected')
    .forEach((a) => {
      const h = historyOf(a);
      const before = h.length > 1 ? h[h.length - 2].status : 'Applied';
      out[before] = (out[before] || 0) + 1;
    });
  return Object.entries(out).sort((a, b) => b[1] - a[1]);
}

const startOfWeek = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); // weeks start on Monday
  return d;
};

// Last `weeks` weeks: applications added + status changes per week
export function weeklyActivity(apps, weeks = 8) {
  const thisWeek = startOfWeek(new Date());
  const buckets = Array.from({ length: weeks }, (_, i) => {
    const start = new Date(thisWeek);
    start.setDate(start.getDate() - (weeks - 1 - i) * 7);
    return { start, added: 0, moved: 0 };
  });
  const idx = (date) => Math.round((startOfWeek(date) - buckets[0].start) / (7 * DAY));
  apps.forEach((a) => {
    const c = idx(a.createdAt);
    if (c >= 0 && c < weeks) buckets[c].added += 1;
    historyOf(a)
      .slice(1)
      .forEach((e) => {
        const m = idx(e.at);
        if (m >= 0 && m < weeks) buckets[m].moved += 1;
      });
  });
  return buckets;
}

// ---------- Follow-up nudges ----------
const LEVEL_ORDER = { high: 0, med: 1, low: 2 };

export function buildNudges(apps) {
  const out = [];
  apps.forEach((a) => {
    const idle = daysSince(lastMoveAt(a));
    const dl = daysUntil(a.deadline);
    const prep = checklistProgress(a);
    const push = (level, title, text, email = false) => out.push({ id: `${a._id}-${title}`, app: a, level, title, text, email });

    if (a.status === 'Offer' && dl !== null && dl >= 0 && dl <= 7)
      push('high', 'Respond to the offer', `${a.company} offer deadline ${dl === 0 ? 'is today' : `is in ${dl} day${dl > 1 ? 's' : ''}`}. Accept, negotiate or ask for more time.`);
    if (!isClosed(a) && dl !== null && dl >= 0 && dl <= 2 && prep.pct < 100)
      push('high', 'Deadline close, prep incomplete', `${a.company} is due ${dl === 0 ? 'today' : `in ${dl} day${dl > 1 ? 's' : ''}`}${prep.total ? ` and your checklist is ${prep.pct}% done` : ' and you have no prep checklist yet'}.`);
    if (a.status === 'Interview' && idle >= 5)
      push('med', 'Follow up after interview', `No update from ${a.company} for ${idle} days. A short thank-you / status note keeps you on their radar.`, true);
    if (a.status === 'Online Test' && idle >= 5)
      push('med', 'Ask about test result', `Test at ${a.company} was ${idle} days ago with no movement. Check the portal or ask the recruiter.`);
    if (a.status === 'Applied' && idle >= 7)
      push(idle >= 14 ? 'med' : 'low', 'No reply yet', `Applied to ${a.company} ${idle} days ago and nothing has changed. Send a polite follow-up or ask your referral.`, true);
    if (a.status === 'Wishlist' && idle >= 14)
      push('low', 'Apply or drop it', `${a.company} has been on your wishlist for ${idle} days. Apply now or remove it.`);
  });
  return out.sort((x, y) => LEVEL_ORDER[x.level] - LEVEL_ORDER[y.level]);
}

export function followUpEmail(app, yourName = '') {
  return `Subject: Following up on my application - ${app.role}

Hi ${app.company} team,

I applied for the ${app.role} position and wanted to follow up on the status of my application. I am very interested in the role and happy to share anything else you may need.

Thank you for your time.

Regards,
${yourName}`;
}
