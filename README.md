# Hospitalia Web

Hospitalia Web is the patient- and provider-facing application for Hospitalia, a healthcare platform that brings appointment discovery, clinical scheduling, and care-team operations into one experience.

## Mission and vision

**Mission:** make healthcare access simpler by helping patients find the right provider and complete an appointment journey with confidence.

**Vision:** create a connected, dependable digital care ecosystem where patients, doctors, hospitals, secretaries, and platform administrators work from the same trusted source of information.

## What the application does

- Public doctor and hospital search, profiles, and appointment booking
- Secure sign-up, sign-in, password recovery, and OTP verification flows
- Role-aware workspaces for patients, doctors, hospitals, secretaries, and administrators
- Doctor availability, locations, appointment management, offline booking, and patient records
- Hospital onboarding, profile setup, doctor imports, and location management
- Secretary scheduling and location-aware workflows
- Admin user, role, privilege, and speciality management
- In-app conversation UI and responsive, accessible dashboard navigation
- English and French locale support

## Core concepts

| Concept | Purpose |
| --- | --- |
| **Patient** | Searches providers, manages beneficiaries, and books or tracks appointments. |
| **Doctor** | Publishes professional details, locations, availability, and manages appointments. |
| **Hospital** | Manages its profile, locations, and associated doctors. |
| **Secretary** | Supports a doctor’s day-to-day schedule and patient workflows according to granted permissions. |
| **Administrator** | Manages users, roles, privileges, and the speciality catalogue. |
| **Speciality** | A reusable clinical classification used during doctor registration and discovery. |

## How it is built

The app uses Next.js App Router and React Server Components for routing and rendering. Mutations and backend reads are isolated in server actions; the shared `lib/api.ts` client provides timeout, retry, request, and error-handling behavior. TanStack Query manages client-side query state, while React Hook Form and Zod validate forms before submission.

```text
Browser
  -> Next.js 16 application (routes, server actions, middleware)
  -> Hospitalia REST API
  -> MongoDB
```

Key directories:

```text
app/           Route groups, pages, layouts, and locale-aware routes
actions/       Server actions grouped by domain
components/    Reusable UI, dashboard shells, and feature components
schema/        Zod validation schemas
types/         Shared TypeScript contracts
lib/           API client, utilities, constants, and error helpers
locales/       English and French translation resources
```

## Technology

- Next.js 16, React 19, TypeScript
- Tailwind CSS 4 and shadcn-style UI primitives
- TanStack Query, React Hook Form, and Zod
- next-international for localization
- Lucide icons, Recharts, XLSX, and supporting UI utilities

## Local development

### Prerequisites

- Node.js 20 or newer
- The Hospitalia backend running locally (default: `http://localhost:5001`)

### Configure

Create `.env` in this directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5001
BASE_URL=http://localhost:3000
NODE_ENV=development
```

Install and run:

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

> Restart the Next.js server after changing `.env`, because environment variables are read when the server starts.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server. |
| `npm run build` | Create an optimized production build. |
| `npm run start` | Serve the production build. |
| `npm run lint` | Run ESLint checks. |

## Backend integration

The frontend expects the API base URL in `NEXT_PUBLIC_API_URL`. Its counterpart is in [`../Hospitalia-web-Backend`](../Hospitalia-web-Backend), which exposes health, REST API, and Swagger documentation endpoints.

For local usage, ensure CORS on the backend allows the port used by this app. The default backend configuration permits `http://localhost:3000` and `http://localhost:3001`.

## Deployment notes

- Use HTTPS and an HTTPS API URL in production.
- Set `NEXT_PUBLIC_API_URL` to the deployed API origin at build time.
- Keep secrets only in the backend environment; do not expose them through `NEXT_PUBLIC_*` variables.
- Run `npm run build` before release and resolve any blocking lint or build errors.

## Contributing

1. Create a focused branch.
2. Keep types, schemas, server actions, and API responses aligned.
3. Run linting and a production build before opening a pull request.
4. Include a concise description and verification steps with each change.

## Author

Built and maintained by **Rashadul Dev**.

---

Hospitalia Web is part of the Hospitalia healthcare platform.

