# PlaceTrack

**Track every application. Land the offer.**

PlaceTrack is a full-stack MERN app that helps students manage their placement season: campus drives, off-campus applications, online tests, interviews and offers, all in one dashboard.

## Features

- Secure auth: signup/login with bcrypt-hashed passwords and JWT (7-day expiry)
- Full CRUD for applications: company, role, status, job type, location, CTC, deadline, job link, notes
- Six-stage pipeline: Wishlist, Applied, Online Test, Interview, Offer, Rejected
- Change status in one click right from the card
- Live dashboard stats and a pipeline breakdown bar
- Deadline highlighting (due today, due in N days, overdue)
- Search, filter by status, sort by recent / deadline / company
- Light and dark themes (remembers your choice)
- Responsive layout, toasts, loading and empty states, delete confirmation
- Per-user data isolation: users can only read, edit or delete their own applications

## Tech stack

| Layer    | Tech |
|----------|------|
| Frontend | React 18, React Router 6, Context API, plain CSS (design tokens, no UI library) |
| Backend  | Node.js, Express, express-validator |
| Database | MongoDB + Mongoose |
| Auth     | JWT, bcryptjs |

## Getting started

Requirements: Node 18+ and MongoDB running locally (or a MongoDB Atlas URI).

```bash
# 1. install everything
npm run install:all

# 2. create env files
cp .env.example .env
cp backend/.env.example backend/.env      # then set a long random JWT_SECRET

# 3. (optional) load demo data: demo@placetrack.dev / demo1234
npm run seed

# 4. run frontend (3000) + backend (5000) together
npm run dev
```

## API

All `/api/applications` routes need the header `auth-token: <jwt>`.

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/createuser` | Register, returns JWT |
| POST | `/api/auth/login` | Login, returns JWT |
| GET | `/api/auth/getuser` | Current user |
| GET | `/api/applications` | List my applications |
| POST | `/api/applications` | Create |
| PUT | `/api/applications/:id` | Update (owner only) |
| DELETE | `/api/applications/:id` | Delete (owner only) |

## Project structure

```
backend/        Express API (routes, models, middleware, seed script)
src/
  components/   Landing, AuthForm, Dashboard, ApplicationCard, ApplicationModal ...
  context/      AuthContext, ApplicationContext, ToastContext
  api.js        fetch wrapper (auth header, error handling)
  config.js     app name, statuses (rename the product here)
```

## Resume bullets (pick 2-3)

- Built **PlaceTrack**, a full-stack MERN application to track job applications through a six-stage hiring pipeline, with JWT authentication, protected routes and per-user data isolation.
- Designed a RESTful API (Express, MongoDB) with server-side validation, enum-checked schemas and ownership checks on every write.
- Implemented a responsive React UI with Context API state management, search/filter/sort, deadline alerts and a persisted light/dark theme.

## Interview talking points

- **Why JWT?** Stateless auth; the token is sent in a header and verified by middleware on each request. The secret lives in `.env`, not in code.
- **How do you stop user A editing user B's data?** Every query includes `{ _id, user: req.user.id }`, so a foreign id simply returns 404.
- **State management?** Context API split by concern (auth, applications, toasts) to avoid prop drilling.
- **What would you improve?** Pagination, email reminders for deadlines (node-cron + Nodemailer), drag-and-drop Kanban board, refresh tokens, automated tests, deployment (Render/Railway + Vercel + Atlas).

## Ideas to extend

1. Kanban board view with drag and drop
2. Email reminders before deadlines
3. Interview prep checklist per company
4. Analytics page (applications per week, conversion rate per stage)
5. Deploy it and add the live link and screenshots to your resume and GitHub
