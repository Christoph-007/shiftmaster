# ShiftMaster

A shift-based job marketplace web app with three roles: **applicants** find
jobs and shifts, **employers** post jobs and manage their workforce, and
**admins** moderate the platform.

## Features

| Applicants | Employers | Admins |
|---|---|---|
| Browse and search jobs, view details | Create, edit and manage job postings | Manage applicants and employers |
| Apply, track applications, respond to job requests | Review applications, shortlist, browse applicant profiles | Moderate job postings |
| View upcoming shifts and attendance | Create shifts, track attendance | Platform analytics dashboard |
| Profile, resume, notifications, settings | Send job requests, notifications, company profile | |

Public landing page, job browsing and separate applicant / employer signup flows.

## Tech stack

React 18, Vite, React Router 6, Tailwind CSS, Axios, Lucide icons, ESLint.
Role-based routing with context for auth and toast notifications.

## Structure

```
src/pages/{public,auth,applicant,employer,admin}/   route-level screens
src/components/{layout,forms,display,modals,auth}/  reusable UI
src/context/  src/hooks/  src/services/api.js       state, hooks, API client
```

## Running locally

```bash
npm install
cp .env.example .env     # optional: point VITE_API_URL at your API
npm run dev              # http://localhost:5173
npm run build            # production build
npm run lint             # ESLint (0 errors; a few style warnings remain)
```

This repository contains the frontend only. It talks to a REST API at
`VITE_API_URL` (default `http://localhost:5000/api`; Vite also proxies `/api`
to port 5000 in development).

## Notes

- The backend API is **not** part of this repository, so screens that need data show empty or fallback content until an API is running at `VITE_API_URL`.
- The landing page shows sample jobs if the API is unreachable.

## License

MIT
