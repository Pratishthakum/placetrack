// Extra icons for the new features (kept separate so Icons.js stays untouched)
const base = { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };
const make = (children) => (props) => <svg {...base} {...props}>{children}</svg>;

export const Download = make(<><path d="M12 3v12M7 11l5 5 5-5M4 21h16" /></>);
export const Calendar = make(<><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></>);
export const Columns = make(<><rect x="3" y="4" width="5" height="16" rx="1.5" /><rect x="9.5" y="4" width="5" height="10" rx="1.5" /><rect x="16" y="4" width="5" height="13" rx="1.5" /></>);
export const Rows = make(<><path d="M4 6h16M4 12h16M4 18h16" /></>);
export const Bookmark = make(<><path d="M6 3h12v18l-6-4-6 4z" /></>);
export const Book = make(<><path d="M4 5a2 2 0 012-2h13v16H6a2 2 0 00-2 2z" /><path d="M4 19V5M8 7h7" /></>);
export const Copy = make(<><rect x="9" y="9" width="12" height="12" rx="2" /><path d="M5 15V5a2 2 0 012-2h10" /></>);
export const Arrow = make(<><path d="M5 12h14M13 6l6 6-6 6" /></>);
export const Spark = make(<><path d="M12 3l2.2 5.8L20 11l-5.8 2.2L12 19l-2.2-5.8L4 11l5.8-2.2z" /></>);
