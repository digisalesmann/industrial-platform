# Industrial Platform Backend

This is a production-ready backend for the industrial-platform project, built with Node.js, Express, PostgreSQL, JWT authentication, and Docker support.

## Features
- User registration and login (JWT-based)
- Asset management (CRUD)
- User profile endpoint
- PostgreSQL database
- TypeScript for safety
- Dockerfile for deployment
- Environment variable support

## Setup

1. Copy `.env.example` to `.env` and fill in your secrets and database URL.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run database migrations to create `users` and `assets` tables (see below).
4. Start in development:
   ```bash
   npm run dev
   ```
5. Build and run for production:
   ```bash
   npm run build && npm start
   ```

## Database Tables

You need two tables:

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE assets (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(100),
  value VARCHAR(100)
);
```

## Docker

To build and run with Docker:
```bash
docker build -t industrial-platform-backend .
docker run -p 4000:4000 --env-file .env industrial-platform-backend
```

## API Endpoints

- `POST /api/auth/register` — Register user
- `POST /api/auth/login` — Login user
- `GET /api/assets` — List assets (auth required)
- `POST /api/assets` — Add asset (auth required)
- `GET /api/users/me` — Get user profile (auth required)
- `GET /health` — Health check

---

This backend is ready to connect to your frontend and can be extended for more features as needed.
