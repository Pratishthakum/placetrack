# PlaceTrack: feature update

No new npm packages. Drag & drop, CSV export and calendar files use browser APIs.
Backend: just restart `npm run dev` (nodemon restarts by itself). If you want the new demo data: `npm run seed`.

## What's new
1. **Kanban board** (Dashboard > Board): drag cards between the six stages. Optimistic update with rollback on error. Touch screens use the "Move to" dropdown on each card.
2. **Detail panel** (click any card): status, prep checklist (saved to DB), status timeline, "Add deadline to calendar" (Google Calendar link + `.ics` with a 1-day-before reminder).
3. **Resources hub** (`/resources`): company prep kit, curated free resources, and your own saved links (stored per user in MongoDB).
4. **Insights** (`/insights`): funnel, weekly activity, response/interview/offer rates, where rejections happen, follow-up nudges with a "Copy follow-up email" button.
5. **Upcoming deadlines strip** (next 14 days + overdue) and **Export CSV** (exports what is currently shown).
6. **Date fixes**: see below.
7. **Company-wise prep**: 13 curated companies, plus "most commonly asked" notes and free links for every other company.
8. **Product vs Service guide** (Resources > Product vs Service): what each type asks round by round, free websites skill by skill (IndiaBIX for aptitude, Striver for DSA, ...), and free mock tests. The company prep kit also shows its type badge and mock tests, and for unknown companies you can pick product/service yourself.
9. **My notes** is its own box in the detail panel (the original notes field), saved when you click outside it, separate from prep material.

## Bugs fixed
- Status-only update (`PUT {status}`) failed with "Company name is required", because update reused the create rules. Update now accepts partial bodies.
- Deadlines mixed UTC and local time, so a date could show one day off. The calendar day is now read from the stored value and never shifts.
- Seed data stored "now + n days" with a time of day; it now stores date-only values.
- Finished (Offer/Rejected) applications with old deadlines floated to the top of "Deadline (soonest)". They are now ignored there, in the "urgent" count and on the strip.
- Dates in a different year now show the year.
- "Recently updated" sort now really sorts by `updatedAt`.

## Where to edit content
- `src/data/resources.js`: the free resource hub.
- `src/data/companyPrep.js`: companies, process notes, "most commonly asked" topics, link builders.
- `src/data/starterChecklist.js`: the default prep checklist.

## New API
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/resources` | My saved links |
| POST | `/api/resources` | Save a link (title, url, category, note) |
| DELETE | `/api/resources/:id` | Remove a saved link |

`/api/applications` now also stores `checklist` and `timeline` (status history).
