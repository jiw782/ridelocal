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
