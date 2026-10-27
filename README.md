# RideLocal

## Tech stack

- **Frontend:** React + Vite + React Router (`RideLocal-FrontEnd/`)
- **Backend:** Node.js + Express + PostgreSQL (`RideLocal-BackEnd/`)

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
