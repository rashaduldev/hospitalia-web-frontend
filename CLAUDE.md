# CLAUDE.md — Hospitalia Web

This file provides essential guidance for Claude Code when working in this repository.

---

## Project Overview

**Hospitalia** is a healthcare SaaS platform built with Next.js 16 (App Router). It connects patients with doctors and hospitals, supporting appointment booking, availability management, and multi-role dashboards.

**Live URLs:**
- Frontend: `https://hospitalia-web.dhrubok.xyz`
- API: `https://hospitalia-api.dhrubok.xyz`

---

## Tech Stack

| Layer | Tool |
|---|---|
| Framework | Next.js 16.1.6 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| UI Components | Shadcn/UI + Radix UI |
| Forms | React Hook Form 7 + Zod 4 |
| Server State | TanStack React Query 5 |
| Tables | TanStack React Table 8 |
| HTTP Client | Custom `apiClient` wrapper (Axios-style via fetch) |
| Auth | JWT in HTTP-only cookies |
| i18n | next-international (en, fr) |
| Icons | Lucide React |
| Toasts | Sonner |
| Date | date-fns + react-day-picker |
| Export | papaparse (CSV), xlsx (Excel) |

---

## Directory Structure

```
/
├── app/
│   └── [locale]/           # All routes wrapped in locale
│       ├── (auth)/         # Login, register, forgot-password, verify-otp, reset-password
│       ├── (dashboard)/    # Protected: dashboard, availability, appointment, settings
│       ├── search/         # Public doctor/hospital search
│       ├── doctor/[userId] # Public doctor profile + booking
│       └── page.tsx        # Landing/home page
├── actions/                # Next.js server actions ("use server")
│   ├── auth.actions.ts
│   ├── user.actions.ts
│   ├── doctor/             # Doctor-specific: availability, slots, location, appointment, booking
│   └── hospital/
├── components/
│   ├── ui/                 # Shadcn/Radix base components
│   ├── pages/              # Page-specific compositions
│   ├── common/             # Shared: AppButton, Pagination, FormUIControllers/*, DataTable
│   └── cells/              # Table cell renderers
├── hooks/                  # Custom React hooks (useLocations, useIsMobile)
├── lib/
│   ├── api.ts              # Central API client with retry logic
│   ├── constants.ts        # Route names + role-based nav config
│   └── utils.ts            # cn() helper
├── providers/              # ReactQueryProvider, AppClientProvider (i18n)
├── schema/                 # Zod validation schemas
├── types/                  # TypeScript interfaces (12 files)
├── locales/                # en.ts, fr.ts translation files
├── config/                 # siteConfig.ts, packages.ts
└── proxy.ts                # Next.js middleware (auth guard + i18n routing)
```

---

## Key Conventions

### Server Actions
All data fetching and mutations are done via **Next.js server actions** in `/actions`. Never call the API directly from client components — always go through an action.

```typescript
// Pattern in actions/
"use server";
import { apiClient } from "@/lib/api";
import { getAccessToken } from "@/actions/auth.actions";

export async function getSomething() {
  const token = await getAccessToken();
  return await apiClient<ResponseType>({
    endpoint: "/api/resource",
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
}
```

### API Client (`lib/api.ts`)
The `apiClient` wraps fetch with retry logic (3 retries, 500ms exponential backoff). All responses follow:
```typescript
ApiResponse<T> {
  success: boolean;
  status: "success" | "error";
  message: string;
  payload: T | null;
  error?: string | null;
}
```

### Form Pattern
Always use **React Hook Form + Zod**. Schemas live in `/schema`. Use controlled form components from `/components/common/FormUIControllers/`:
- `ControlledInput`
- `ControlledSelect`
- `ControlledPhoneInput`
- `ControlledDatePicker`
- `ControlledDateInput`
- `ControlledTextarea`

### React Query
Server state is managed with React Query. Use `useQuery` for reads and `useMutation` for writes. Optimistic updates are the preferred pattern (see `useLocations.ts` as reference).

Provider config: 5-minute stale time, 1 retry, no refetch on window focus.

### Authentication
- Tokens stored in HTTP-only cookies (`accessToken`, `refreshToken`)
- Always call `getAccessToken()` inside server actions
- Middleware (`proxy.ts`) handles route protection

### Routing
All routes are under `[locale]` for i18n. Route constants are defined in `lib/constants.ts`. Role-based nav links are also in constants.

### Styling
- Use Tailwind utilities only — no custom CSS files
- Primary color: `#155dfc` (blue), secondary: `#61d397` (green)
- Dashboard background: `#f9fbfd`
- Fonts: "Plus Jakarta Sans" (brand), "Inter" (body)
- Dark mode supported via `next-themes`

### Component Naming
- Page components: PascalCase, describe the page (e.g., `PatientDashboardPage.tsx`)
- UI primitives: lowercase (Shadcn convention, e.g., `button.tsx`, `card.tsx`)
- Common/shared: PascalCase (e.g., `AppButton.tsx`, `Pagination.tsx`)

---

## User Roles

| Role | Access |
|---|---|
| `ADMIN` | Full admin dashboard |
| `DOCTOR` | Availability, appointments, secretary management |
| `HOSPITAL` | Hospital dashboard, doctor management |
| `PATIENT` | Appointment booking, patient dashboard |

Role-based sidebar navigation is configured in `lib/constants.ts`.

---

## Running the Project

```bash
npm install
npm run dev        # Development server on http://localhost:3000
npm run build      # Production build
npm run start      # Start production server
npm run lint       # ESLint check
```

---

## Environment Variables

```env
NEXT_PUBLIC_API_URL=https://hospitalia-api.dhrubok.xyz
NODE_ENV=production
BASE_URL=https://hospitalia-web.dhrubok.xyz
```

---

## Active Branch

Currently working on: `patient-module` (branched from `staging`)
