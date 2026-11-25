// Lightweight inline SVG icons (no external icon kit needed)
const base = { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };
const make = (children) => (props) => <svg {...base} {...props}>{children}</svg>;

export const Plus = make(<><path d="M12 5v14M5 12h14" /></>);
export const Search = make(<><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>);
export const Edit = make(<><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z" /></>);
export const Trash = make(<><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v6M14 11v6" /></>);
export const External = make(<><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14 21 3" /></>);
export const Pin = make(<><path d="M12 21s-7-6.2-7-11a7 7 0 0114 0c0 4.8-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></>);
export const Wallet = make(<><path d="M20 7H5a2 2 0 010-4h13v4zM3 5v14a2 2 0 002 2h15V7" /><circle cx="16.5" cy="14" r="1.2" /></>);
export const Clock = make(<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>);
export const Sun = make(<><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>);
export const Moon = make(<><path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z" /></>);
export const Check = make(<><path d="m5 12 5 5 9-10" /></>);
export const Close = make(<><path d="M6 6l12 12M18 6 6 18" /></>);
export const Logout = make(<><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" /></>);
export const Target = make(<><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1" /></>);
export const Layers = make(<><path d="m12 2 10 5-10 5L2 7z" /><path d="m2 12 10 5 10-5M2 17l10 5 10-5" /></>);
export const Bell = make(<><path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 01-3.4 0" /></>);
export const Chart = make(<><path d="M3 3v18h18" /><path d="M7 15l4-4 3 3 5-6" /></>);

export const Logo = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
    <rect width="64" height="64" rx="16" fill="var(--brand)" />
    <path d="M18 46V18h15a10 10 0 010 20H18" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="46" cy="46" r="5" fill="#ffb454" />
  </svg>
);
