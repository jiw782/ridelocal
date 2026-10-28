# RideLocal

**Find and host group bike rides in your neighborhood.**

- Live site: _add Netlify link_
- API: _add Render link_

<!-- Add screenshots to docs/screenshots/ and uncomment:
![Home page with zip code search](docs/screenshots/home.png)
![Ride details with riders](docs/screenshots/ride-details.png)
-->

## Overview

### The problem

Group rides are one of the best ways to start cycling or to meet other riders. But they're usually announced in scattered places, like bike shop flyers, group chats and social media pages. If you don't already know the right people, it's hard to find out what's happening near you, and hard to tell whether a ride matches your pace.

### Goals

- Let anyone search their zip code and see upcoming rides nearby, soonest first
- Make it easy to tell if a ride is right for you: difficulty, meeting spot, time and how full it is
- Let riders host their own rides and manage who's coming
- Keep meeting spots and rider lists visible only to members

## Features

- **Zip code search:** upcoming rides in any US zip code, labeled with the city and state. Logged-in users start at their own zip code.
- **Host rides:** create, edit and delete rides with a title, meeting spot, date and time, difficulty (easy, moderate or hard) and an optional rider limit.
- **Join and leave rides:** the rider count and progress bar update right away, and full rides can't be joined.
- **Real zip codes only:** every zip code is checked against the [Zippopotam](https://api.zippopotam.us) API before a ride is saved.
- **Profiles:** see the rides you're hosting and have joined, edit your bio and picture, and view other riders' public profiles.
- **Member-only details:** visitors can browse rides, but meeting spots and rider lists require an account. After logging in, you return to the ride you were looking at.
- **Responsive design:** works on phones and desktops, with automatic dark mode.

## Tech stack

- **Frontend:** React 19, React Router 8, Vite. Plain CSS with no UI library.
- **Backend:** Node.js 22+, Express 5
- **Database:** PostgreSQL, through the `pg` driver with hand-written SQL
- **Auth:** JSON Web Tokens (`jsonwebtoken`) and password hashing (`bcrypt`)
- **External API:** [Zippopotam](https://api.zippopotam.us) for zip code lookups (free, no key)
- **Hosting:** Netlify (frontend) and Render (API and database)

## Architecture

```
Browser (React on Netlify)
   │  fetch /api/...  with  Authorization: Bearer <token>
   ▼
Express API (Render) ──► Zippopotam (zip → city, state)
   │  SQL
   ▼
PostgreSQL (Render)
```

The React app only talks to the Express API. The API checks the token, validates the input, runs SQL queries and returns JSON. Zip lookups go through the backend, which caches each answer so Zippopotam is called once per zip code.

The database has three tables: `users`, `rides`, and `ride_members`, which links riders to the rides they've joined. A ride's host is also a member of their own ride, so they count toward its rider limit.

### Folder structure

```
RideLocal-BackEnd/
  server.js            connects to the database and starts the server
  app.js               middleware, routers and error handling
  api/                 route handlers: users, rides, zips
  db/
    schema.sql         table definitions
    seed.js            demo users and rides
    queries/           one file of SQL functions per table
  middleware/          reads the login token; blocks logged-out requests
  utils/               JWT helpers, Zippopotam lookup

RideLocal-FrontEnd/
  src/
    App.jsx            page routes
    api.js             fetch helper that adds the token and backend URL
    auth/              login state (AuthContext), login and register pages
    layout/            navbar and shared icons
    rides/             search, ride details, ride form, new and edit pages
    users/             your profile, edit profile, other riders' profiles
  public/_redirects    lets Netlify serve React Router pages on refresh
```

During development, Vite forwards `/api` requests to Express on port 3000. In production, the frontend uses `VITE_API_URL` to reach the API on Render. If you build the frontend, Express can also serve it from `RideLocal-FrontEnd/dist`, so the whole app can run on one server.

## Getting started

Requires Node.js 22+ and PostgreSQL.

### Backend

```bash
cd RideLocal-BackEnd
cp example.env .env      # then fill in DATABASE_URL
npm install
createdb ridelocal
npm run db:reset         # creates tables and seeds data
npm run dev              # http://localhost:3000
```

### Frontend

```bash
cd RideLocal-FrontEnd
npm install
npm run dev              # http://localhost:5173
```

In development, Vite forwards `/api/*` requests to the backend on port 3000.

Every seed user logs in with the password `password123`, e.g. `maya@example.com`.

### Environment variables

| Where | Variable | Purpose |
|---|---|---|
| Backend | `DATABASE_URL` | Postgres connection string |
| Backend | `JWT_SECRET` | Long random string for signing tokens |
| Backend | `NODE_ENV` | Set to `production` to connect to the hosted database over SSL |
| Backend | `CORS_ORIGIN` | The deployed frontend's URL, without a trailing `/` |
| Frontend | `VITE_API_URL` | The deployed API's URL, without a trailing `/`. Leave unset locally. |

## API

All endpoints are under `/api`. Request and response bodies are JSON; errors are sent as plain text with a matching status code.

Endpoints marked 🔒 need a logged-in user. Send the token from register or login as a header:

```
Authorization: Bearer <token>
```

A missing or invalid token on a 🔒 endpoint returns `401`. An id that isn't a number returns `400`.

### Users

| Method | Path | Body | Success | Errors |
|---|---|---|---|---|
| `POST` | `/users/register` | `name`, `email`, `password`, `zip_code` | `201` `{ token, user }` | `400` missing field, `409` email taken |
| `POST` | `/users/login` | `email`, `password` | `200` `{ token, user }` | `400` missing field, `401` wrong email or password |
| `GET` | `/users/me` 🔒 | | `200` user | |
| `PUT` | `/users/me` 🔒 | `name`, `zip_code`, `bio`?, `profile_pic`? | `200` updated user | `400` missing name or zip |
| `GET` | `/users/me/rides` 🔒 | | `200` upcoming rides you've joined or are hosting | |
| `GET` | `/users/:id` | | `200` public user (no email) | `404` |
| `GET` | `/users/:id/rides` | | `200` upcoming rides the user is hosting | |

A **user** looks like `{ id, name, email, zip_code, bio, profile_pic }`. Password hashes are never sent.

### Rides

| Method | Path | Body | Success | Errors |
|---|---|---|---|---|
| `GET` | `/rides?zip=77001` | | `200` upcoming rides in that zip, soonest first. Without `zip`, the next 20 upcoming rides anywhere | |
| `POST` | `/rides` 🔒 | `title`, `zip_code`, `meeting_spot`, `ride_date`, `description`?, `difficulty`?, `max_riders`? | `201` ride (the host joins it automatically) | `400` missing or invalid field |
| `GET` | `/rides/:id` 🔒 | | `200` ride with `creator_name` | `404` |
| `PUT` | `/rides/:id` 🔒 host only | same as `POST /rides` | `200` updated ride | `400` missing field or `max_riders` below current riders, `403`, `404` |
| `DELETE` | `/rides/:id` 🔒 host only | | `200` deleted ride | `403`, `404` |
| `GET` | `/rides/:id/riders` 🔒 | | `200` `[{ id, name, profile_pic }]` | |
| `POST` | `/rides/:id/join` 🔒 | | `201` `{ ride_id, user_id }` | `404`, `409` full or already joined |
| `DELETE` | `/rides/:id/join` 🔒 | | `200` `{ ride_id, user_id }` | `400` host can't leave, `404` not joined |

A **ride** looks like `{ id, creator_id, title, description, zip_code, meeting_spot, ride_date, difficulty, max_riders }`. The `GET` routes also include `rider_count`.

- `ride_date` is an ISO 8601 timestamp, e.g. `2027-01-01T15:00:00Z`.
- `difficulty` is `easy` (default), `moderate` or `hard`.
- `max_riders` is a number of at least 1, or `null` for no limit.

### Other

| Method | Path | Success |
|---|---|---|
| `GET` | `/health` | `200` `{ status: "ok" }` |
