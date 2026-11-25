const DAY = 86400000;
const pad = (n) => String(n).padStart(2, '0');

// ---------- Dates ----------
// Deadlines are date-only values saved as UTC midnight ("2026-11-25T00:00:00.000Z").
// FIX: the old helpers mixed UTC (toISOString) and local time (setHours / toLocaleDateString),
// so a deadline could show as one day off depending on timezone or the time it was saved.
// Now the calendar day is read straight from the ISO string and never shifts.
const DAY_RE = /^(\d{4})-(\d{2})-(\d{2})/;

// 'YYYY-MM-DD' for a stored deadline, or '' if none/invalid
export function dayKey(value) {
  if (!value) return '';
  let iso = value;
  if (typeof value !== 'string') {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return '';
    iso = d.toISOString();
  }
  const m = DAY_RE.exec(iso);
  return m ? `${m[1]}-${m[2]}-${m[3]}` : '';
}

// Local-midnight Date for that calendar day (null if none)
export function parseDay(value) {
  const k = dayKey(value);
  if (!k) return null;
  const [y, m, d] = k.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

// Whole days from today until the date (negative = overdue). null if no date.
export function daysUntil(value) {
  const d = parseDay(value);
  if (!d) return null;
  return Math.round((d - startOfToday()) / DAY);
}

// "25 Nov" (adds the year only when it is not the current year)
export function formatDate(value) {
  const d = parseDay(value);
  if (!d) return '';
  const opts = { day: 'numeric', month: 'short' };
  if (d.getFullYear() !== new Date().getFullYear()) opts.year = 'numeric';
  return d.toLocaleDateString('en-IN', opts);
}

// Value for <input type="date">
export const toInputDate = (value) => dayKey(value);

// Real timestamps (status changes, createdAt) are instants, so these use local time
export const formatDateTime = (value) =>
  value
    ? new Date(value).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })
    : '';

export const daysSince = (value) => (value ? Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / DAY)) : 0);

// ---------- Application helpers ----------
export const isClosed = (app) => app.status === 'Offer' || app.status === 'Rejected';

// Days to the deadline, ignoring applications that are already finished (FIX: finished
// applications with an old deadline used to float to the top of "Deadline (soonest)")
export const openDeadlineDays = (app) => (isClosed(app) ? null : daysUntil(app.deadline));

export const checklistProgress = (app) => {
  const list = app.checklist || [];
  const done = list.filter((i) => i.done).length;
  return { done, total: list.length, pct: list.length ? Math.round((done / list.length) * 100) : 0 };
};

// ---------- Downloads ----------
export function downloadFile(filename, mime, content) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const CSV_COLUMNS = [
  ['Company', (a) => a.company],
  ['Role', (a) => a.role],
  ['Status', (a) => a.status],
  ['Type', (a) => a.type],
  ['Location', (a) => a.location],
  ['CTC / Stipend', (a) => a.ctc],
  ['Deadline', (a) => dayKey(a.deadline)],
  ['Job link', (a) => a.link],
  ['Prep checklist', (a) => {
    const p = checklistProgress(a);
    return p.total ? `${p.done}/${p.total}` : '';
  }],
  ['Notes', (a) => a.notes],
  ['Added on', (a) => (a.createdAt ? new Date(a.createdAt).toLocaleDateString('en-CA') : '')],
  ['Last updated', (a) => (a.updatedAt ? new Date(a.updatedAt).toLocaleDateString('en-CA') : '')],
];

// Quote every cell; neutralise leading = + - @ so Excel never runs a cell as a formula
const csvCell = (v) => {
  let s = v == null ? '' : String(v);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
};

export function exportApplicationsCsv(apps) {
  const rows = [CSV_COLUMNS.map(([h]) => csvCell(h)).join(',')];
  apps.forEach((a) => rows.push(CSV_COLUMNS.map(([, get]) => csvCell(get(a))).join(',')));
  // BOM so Excel opens UTF-8 correctly
  downloadFile(`placetrack-${new Date().toLocaleDateString('en-CA')}.csv`, 'text/csv;charset=utf-8', '\uFEFF' + rows.join('\r\n'));
}

// ---------- Calendar ----------
const ymd = (d) => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
const eventTitle = (app) => `Deadline: ${app.company} - ${app.role}`;
const eventDetails = (app) =>
  [`Status: ${app.status}`, app.link ? `Job link: ${app.link}` : '', app.notes ? `Notes: ${app.notes.slice(0, 400)}` : '', 'Added from PlaceTrack']
    .filter(Boolean)
    .join('\n');

// All-day event on the deadline day. Returns null if the application has no deadline.
export function googleCalendarUrl(app) {
  const start = parseDay(app.deadline);
  if (!start) return null;
  const end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 1);
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: eventTitle(app),
    dates: `${ymd(start)}/${ymd(end)}`,
    details: eventDetails(app),
  });
  if (app.location) params.set('location', app.location);
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

const icsEscape = (s = '') => String(s).replace(/\\/g, '\\\\').replace(/\r?\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
const fold = (line) => (line.length <= 73 ? line : line.match(/.{1,73}/g).join('\r\n '));

// .ics works with Apple / Outlook / Google Calendar. Includes a reminder 1 day before.
export function downloadIcs(app) {
  const start = parseDay(app.deadline);
  if (!start) return false;
  const end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 1);
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//PlaceTrack//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${app._id}-${ymd(start)}@placetrack`,
    `DTSTAMP:${stamp}`,
    `DTSTART;VALUE=DATE:${ymd(start)}`,
    `DTEND;VALUE=DATE:${ymd(end)}`,
    `SUMMARY:${icsEscape(eventTitle(app))}`,
    `DESCRIPTION:${icsEscape(eventDetails(app))}`,
    ...(app.location ? [`LOCATION:${icsEscape(app.location)}`] : []),
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    `DESCRIPTION:${icsEscape(eventTitle(app))}`,
    'TRIGGER:-P1D',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  const safe = app.company.replace(/[^a-z0-9]+/gi, '-').toLowerCase();
  downloadFile(`${safe}-deadline.ics`, 'text/calendar;charset=utf-8', lines.map(fold).join('\r\n'));
  return true;
}

// ---------- Misc ----------
// Stable colour per company name for the avatar badge
const PALETTE = ['#5b4bff', '#0ea5a4', '#e5484d', '#f59e0b', '#2f9e44', '#d6409f', '#2b7de9', '#8b5cf6'];
export function colorFor(name = '') {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return PALETTE[h % PALETTE.length];
}

export const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
};
