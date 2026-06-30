# Fakend Backend

API server for **Fakend** — a mock API platform that lets software teams (especially frontend developers and QA) build, share, and consume fake API responses without running a real backend.

Create projects, define routes with multiple response scenarios (status codes and JSON bodies), and share links so teammates can point their apps at predictable mock responses during development and testing.

> **Project status:** Fakend is still in active development. Core features (mock API gateway, full project management APIs, and more) are being built out. Expect breaking changes, incomplete endpoints, and new functionality in future releases.

## Technologies

| Layer | Stack |
| --- | --- |
| Runtime | Node.js |
| Framework | [NestJS](https://nestjs.com/) 11 |
| Language | TypeScript 5 |
| Database | PostgreSQL |
| ORM | [Prisma](https://www.prisma.io/) 7 |
| Auth | Passport (Google OAuth, GitHub OAuth, JWT) |
| Validation | class-validator, class-transformer |
| Logging | [Pino](https://getpino.io/) via nestjs-pino |
| Package manager | [pnpm](https://pnpm.io/) |

## Prerequisites

- **Node.js** 20+ (LTS recommended)
- **pnpm** 9+
- **PostgreSQL** 14+ (local instance or hosted database)

## Default ports

| Service | Port |
| --- | --- |
| Backend API | `8080` (override with `PORT` in `.env`) |
| Frontend (for CORS / OAuth redirects) | `3000` |

## Quick start

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment variables

Create a `.env` file in the project root (see [Environment variables](#environment-variables) below).

### 3. Set up the database

```bash
npx prisma generate
npx prisma migrate dev
```

### 4. Run in development

```bash
pnpm dev
```

The server starts at **http://localhost:8080** by default.

Verify it is running:

```bash
curl http://localhost:8080/test
```

Expected response:

```json
{
  "status": "ok",
  "timestamp": "2026-06-30T12:00:00.000Z"
}
```

## Environment variables

Create a `.env` file in the repository root. This file is gitignored — never commit secrets.

```env
# App
NODE_ENV=development
PORT=8080
FRONTEND_URL=http://localhost:3000

# Database (PostgreSQL)
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/fakend?schema=public

# JWT
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=15m

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:8080/auth/oauth/google/callback

# GitHub OAuth
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GITHUB_CALLBACK_URL=http://localhost:8080/auth/oauth/github/callback
```

### Variable reference

| Variable | Required | Description |
| --- | --- | --- |
| `NODE_ENV` | No | `development` or `production`. Affects logging level and cookie security. |
| `PORT` | No | HTTP port. Defaults to `8080`. |
| `FRONTEND_URL` | Yes | Frontend origin used for CORS and OAuth redirects (e.g. `http://localhost:3000`). |
| `DATABASE_URL` | Yes | PostgreSQL connection string for Prisma. |
| `JWT_SECRET` | Yes | Secret used to sign access and refresh tokens. |
| `JWT_EXPIRES_IN` | Yes | Access token lifetime (e.g. `15m`, `1h`). |
| `GOOGLE_CLIENT_ID` | Yes* | Google OAuth client ID. |
| `GOOGLE_CLIENT_SECRET` | Yes* | Google OAuth client secret. |
| `GOOGLE_CALLBACK_URL` | Yes* | Must match the redirect URI registered in Google Cloud Console. |
| `GITHUB_CLIENT_ID` | Yes* | GitHub OAuth app client ID. |
| `GITHUB_CLIENT_SECRET` | Yes* | GitHub OAuth app client secret. |
| `GITHUB_CALLBACK_URL` | Yes* | Must match the callback URL registered in the GitHub OAuth app. |

\* Required only if you use that OAuth provider.

### OAuth setup notes

- **Google**: Create credentials in [Google Cloud Console](https://console.cloud.google.com/). Authorized redirect URI must be `GOOGLE_CALLBACK_URL`.
- **GitHub**: Create an OAuth app under **Settings → Developer settings → OAuth Apps**. Authorization callback URL must be `GITHUB_CALLBACK_URL`.
- `FRONTEND_URL` must match the URL where the **fakend-frontend** app runs so users are redirected to `/auth/oauth/callback` after login.

## Available scripts

| Script | Command | Description |
| --- | --- | --- |
| Development | `pnpm dev` | Start with file watching |
| Production build | `pnpm build` | Compile to `dist/` |
| Production run | `pnpm prod` | Run compiled app (`node dist/main`) |
| Start (no watch) | `pnpm start` | Start without watch mode |
| Debug | `pnpm debug` | Start with Node inspector |
| Lint | `pnpm lint` | Run ESLint with auto-fix |
| Format | `pnpm format` | Run Prettier |
| Unit tests | `pnpm test` | Run Jest unit tests |
| E2E tests | `pnpm test:e2e` | Run end-to-end tests |
| Coverage | `pnpm test:cov` | Run tests with coverage report |

## Project structure

```
fakend-backend/
├── prisma/
│   ├── schema.prisma          # Database schema (User, Project, Route, RouteResponse)
│   └── migrations/            # Prisma migration history
├── prisma.config.ts           # Prisma 7 config (datasource URL from env)
├── src/
│   ├── main.ts                # App bootstrap, CORS, global pipes/filters
│   ├── app.module.ts          # Root module (config, JWT, feature modules)
│   ├── app.controller.ts      # Health/test endpoints
│   ├── auth/                  # OAuth + JWT authentication
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── passport-strategy/ # Google, GitHub, JWT strategies
│   ├── user/                  # User persistence and lookup
│   ├── project/               # Mock API projects
│   ├── route/                 # HTTP routes (method + path) per project
│   ├── route-response/        # Response scenarios (status code + JSON body)
│   └── common/
│       ├── prisma/            # PrismaService module
│       ├── app-logger/        # Pino logger setup
│       ├── decorators/        # @CurrentUser, @OauthUser, @Cookie
│       ├── filters/           # Prisma exception handling
│       ├── guards/            # JWT and OAuth callback guards
│       └── interceptors/      # Refresh-token cookie, OAuth redirect
├── test/                      # E2E tests
├── package.json
├── tsconfig.json
└── nest-cli.json
```

## Data model

Fakend organizes mock APIs around four core entities:

```
User
 └── (owns) Project
              └── Route (HTTP method + path)
                       └── RouteResponse (scenario, statusCode, body)
```

| Model | Purpose |
| --- | --- |
| **User** | Authenticated account (Google or GitHub). Linked via `UserProvider`. |
| **Project** | A mock API workspace with a unique secret and optional owner. |
| **Route** | An endpoint definition (`GET`, `POST`, etc.) and path within a project. |
| **RouteResponse** | A named **scenario** (default: `default`) with an HTTP **status code** and JSON **body**. |

This lets teams define multiple behaviors for the same route — for example `default` (200), `unauthorized` (401), or `server-error` (500) — and switch scenarios when calling the mock URL.

Supported HTTP methods: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`.

## API overview

### Health / test

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| `GET` | `/test` | No | Simple health check |
| `GET` | `/test-protected` | No* | Test endpoint (protection TBD) |

### Authentication

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| `GET` | `/auth/oauth/google` | No | Start Google OAuth flow |
| `GET` | `/auth/oauth/google/callback` | No | Google OAuth callback |
| `GET` | `/auth/oauth/github` | No | Start GitHub OAuth flow |
| `GET` | `/auth/oauth/github/callback` | No | GitHub OAuth callback |
| `POST` | `/auth/refresh` | Cookie | Issue new access token using `refreshToken` httpOnly cookie |
| `POST` | `/auth/me` | Bearer JWT | Return current user profile |
| `POST` | `/auth/logout` | Bearer JWT | Log out (placeholder) |

**Auth flow summary**

1. User clicks “Sign in with Google/GitHub” on the frontend.
2. Backend completes OAuth and redirects to `{FRONTEND_URL}/auth/oauth/callback?token=...`.
3. A `refreshToken` httpOnly cookie is set on `/auth/refresh`.
4. The frontend stores the access token and calls protected endpoints with `Authorization: Bearer <token>`.

### Mock API management (in progress)

| Method | Path | Description |
| --- | --- | --- |
| `POST` | `/route` | Create a route (auto-creates a project if `projectId` is omitted) |
| `POST` | `/route-response` | Attach a response scenario to a route |

Request bodies are validated with DTOs under `src/*/dto/`.

## How mock APIs are intended to work

1. **Create a project** — a container for related mock endpoints.
2. **Define routes** — e.g. `GET /users`, `POST /orders`.
3. **Add response scenarios** — each with a `statusCode` and JSON `body`.
4. **Share the link** — teammates paste the Fakend URL into their app config (fetch, Axios, etc.) instead of a real API base URL.
5. **Select a scenario** — via query param or header (convention to be finalized in the public mock gateway).

This removes the need for a local backend or staging environment when testing UI states, error handling, and loading behavior.

## CORS

CORS is enabled for the origin defined in `FRONTEND_URL`, with credentials support for refresh-token cookies:

- Allowed methods: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`
- `credentials: true`

## Database commands

```bash
# Apply migrations after pulling new changes
npx prisma migrate dev

# Regenerate Prisma Client after schema changes
npx prisma generate

# Open Prisma Studio (database GUI)
npx prisma studio
```

## Production build

```bash
pnpm build
pnpm prod
```

Set `NODE_ENV=production` and use secure values for `JWT_SECRET` and OAuth credentials. In production, refresh-token cookies use `secure: true` and `sameSite: 'none'`.

## Related repository

- **Frontend**: `fakend-frontend` — Next.js dashboard and marketing site that talks to this API.

## License

UNLICENSED — private project.
