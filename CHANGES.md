# What changed from iNotebook

- Product: iNotebook (notes) -> PlaceTrack (placement application tracker)
- Notes model -> Application model (company, role, status, type, location, CTC, deadline, link, notes)
- Stack upgraded: React 17 -> 18, Router 5 -> 6, react-scripts 4 -> 5 (works on modern Node), Mongoose 6 -> 8
- Bootstrap CDN + FontAwesome kit removed; new custom design system with dark mode
- Bugs fixed:
  - Hardcoded auth token in NoteState (everyone shared one account) -> real login via AuthContext
  - Signup page was a placeholder -> working signup
  - JWT secret and Mongo URI were hardcoded -> moved to backend/.env
  - fetchuser sent two responses when the token was missing -> returns once
  - Update/delete now filter by owner inside the query
  - Alert showed a fixed message on every page -> toast notifications
  - "both" script used a nodemon that wasn't installed at root -> `npm run dev`
