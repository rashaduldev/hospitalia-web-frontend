# Architecture — Hospitalia Web

---

## System Overview

Hospitalia is a **multi-tenant healthcare platform** where Patients can discover and book appointments with Doctors, managed through Hospital accounts. The frontend is a Next.js 16 application consuming a REST API backend.

```
┌─────────────────────────────────────────────────────────┐
│                     Browser / Client                     │
│  React 19 · Tailwind CSS 4 · TanStack Query · RHF+Zod   │
└────────────────────┬────────────────────────────────────┘
                     │ HTTPS
┌────────────────────▼────────────────────────────────────┐
│               Next.js 16 (App Router)                    │
│  Server Actions · Middleware (auth guard + i18n) · SSR   │
└────────────────────┬────────────────────────────────────┘
                     │ fetch (server-side)
┌────────────────────▼────────────────────────────────────┐
│            REST API — hospitalia-api.dhrubok.xyz          │
│               (external, not in this repo)               │
└─────────────────────────────────────────────────────────┘
```

---

## Application Layers

### 1. Routing Layer (`app/[locale]/`)

All routes are wrapped in a `[locale]` dynamic segment, enabling English/French i18n without URL overhead (managed by `next-international`).

```
app/[locale]/
├── (auth)/                   # Unauthenticated pages
│   ├── login/                # Doctor/Hospital login
│   ├── patient/login/        # Patient login
│   ├── patient/register/     # Patient registration
│   ├── register/             # Doctor/Hospital registration
│   ├── forgot-password/
│   ├── verify-otp/
│   └── reset-password/
├── (dashboard)/              # Protected pages (requires valid JWT)
│   ├── dashboard/            # Role-based home dashboard
│   ├── availability/         # Doctor schedule management
│   ├── appointment/          # Patient appointments
│   ├── secretary/            # Doctor secretary management
│   ├── message/              # Messaging
│   └── settings/
├── search/                   # Public: search doctors/hospitals
├── doctor/[userId]/          # Public: doctor profile + booking flow
└── page.tsx                  # Landing page
```

**Route Groups:**
- `(auth)` — No sidebar/navbar layout
- `(dashboard)` — Includes `app-sidebar` + `site-header` shell

### 2. Middleware Layer (`proxy.ts`)

Next.js middleware runs on every request before rendering:

```
Request
  │
  ├── i18n locale detection & routing (next-international)
  │
  ├── Is route protected?
  │     ├── YES → Check accessToken cookie
  │     │           ├── Token exists → Allow
  │     │           └── No token → Redirect to "/"
  │     └── NO  → Allow (public routes)
  │
  └── Set X-Accel-Buffering: no header (streaming support)
```

**Public routes:** `/`, `/search`, `/login`, `/register`, `/doctor/*`, `/hospital`, `/patient/*`, `/forgot-password`, `/verify-otp`, `/reset-password`

### 3. Data Layer (`actions/`)

All API communication is isolated in **Next.js server actions**. Client components never call the API directly.

```
actions/
├── auth.actions.ts           # login, register, logout, OTP, password reset
│                             # getAccessToken(), setAuthCookies(), deleteAuthCookies()
├── user.actions.ts           # getCurrentUser()
├── doctor/
│   ├── doctordata.ts         # getAllDoctors(), getSingleDoctor()
│   ├── availability.ts       # getDoctorAvailability(), createAvailability(), updateAvailability()
│   ├── slot.ts               # getAvailableSlots()
│   ├── location.ts           # createLocation(), updateLocation(), deleteLocation()
│   ├── appointment.ts        # getTodaysAppointments(), getUpcomingAppointments(), cancelAppointment()
│   ├── booking.ts            # bookAppointment()
│   └── unavailability.ts     # markUnavailableDate()
├── hospital/
│   └── hospitaldata.ts       # getHospitalData()
└── search.ts                 # globalSearch()
```

**API Client** (`lib/api.ts`):
- Single `apiClient<T>()` function
- Retry logic: 3 attempts, 500ms exponential backoff
- Supports GET, POST, PUT, PATCH, DELETE, file downloads
- Standardized `ApiResponse<T>` response envelope

### 4. Component Layer

```
components/
├── ui/                       # Shadcn/Radix primitives (never modified directly)
│   └── button, card, dialog, table, calendar, input, select, tabs...
├── pages/                    # Feature-area compositions
│   ├── home/                 # Banner, Header, OurPackages, SearchForm, Stats, WhyChooseUs
│   ├── auth/                 # LoginForm, RegisterForm, PatientLogin, PatientRegister, ForgotPassword
│   ├── booking/              # BookingClientSection, DoctorProfile, DoctorBooking
│   ├── search/               # SearchFormWrapper, results display
│   └── dashboard/            # AdminDashboardPage, HospitalDashboardPage, PatientDashboardPage
│       └── availability/     # Availability, ScheduleManager
├── common/                   # Cross-feature shared components
│   ├── FormUIControllers/    # ControlledInput, ControlledSelect, ControlledPhoneInput...
│   ├── AppButton.tsx         # Enhanced button with loading state
│   ├── data-table.tsx        # Reusable TanStack Table with sort/filter/export
│   ├── Pagination.tsx
│   ├── app-sidebar.tsx       # Role-based navigation sidebar
│   ├── site-header.tsx       # Dashboard top bar with user avatar
│   └── Footer.tsx
└── cells/                    # TanStack Table cell renderers
```

### 5. State Management

No global client state store (no Redux/Zustand). State is distributed:

| Concern | Solution |
|---|---|
| Server/async data | TanStack React Query |
| Form state | React Hook Form |
| Auth state | HTTP-only cookies (server-read) |
| UI state | React `useState`/`useReducer` |
| Theme | next-themes context |
| i18n | next-international context |

**React Query Setup** (`providers/ReactQueryProvider.tsx`):
- `staleTime: 5 minutes`
- `retry: 1`
- `refetchOnWindowFocus: false`

### 6. Type System (`types/`)

```
types/
├── auth.types.ts             # LoginRequestData, LoginResponseData, RegisterUser
├── user.types.ts             # User, CurrentUser, NewUser
├── doctor.types.ts           # SingleDoctorInfo
├── appointment.types.ts      # Appointment, AppointmentBookingRequest, AvailableSlot
├── availability.types.ts     # DoctorAvailabilitySlot, UnavailableDate
├── location.types.ts         # DoctorLocation
├── search.types.ts           # SearchFormValues, SearchResultItem
├── patient.types.ts          # PatientRegisterRequestData
├── speciality.types.ts       # Speciality
└── api.types.ts              # ApiResponse<T>, Paginated<T>
```

### 7. Validation Layer (`schema/`)

Zod schemas colocated by domain, consumed by React Hook Form via `@hookform/resolvers/zod`:

```
schema/
├── userSchema.ts             # login, register validation
├── patientSchema.ts          # patient registration
├── bookingSchema.ts          # appointment booking
├── passwordSchema.ts         # forgot/reset password
└── locationSchema.ts         # doctor location CRUD
```

---

## Authentication Architecture

```
User submits credentials
        │
        ▼
  LoginForm (client)
        │ calls server action
        ▼
  auth.actions.ts → POST /api/auth/sign-in
        │
        ├── Success → setAuthCookies(accessToken, refreshToken)
        │               accessToken: 1hr, httpOnly
        │               refreshToken: 3 days, httpOnly
        │            → redirect("/dashboard")
        │
        └── Failure → return error message to form
```

**Every protected server action:**
```typescript
const token = await getAccessToken();  // reads cookie server-side
// token passed in Authorization header
```

**Logout:**
```typescript
await POST /api/auth/sign-out
deleteAuthCookies()  // removes both cookies
redirect("/")
```

---

## Booking Flow

```
/doctor/[userId]
        │
        ▼
  DoctorProfile       ← getSingleDoctor()
        │
        ▼
  BookingClientSection
        │
        ├── 1. Select Location    ← getLocations()
        ├── 2. Pick Date          ← react-day-picker
        ├── 3. Select Time Slot   ← getAvailableSlots(date, locationId)
        ├── 4. Enter Patient Note
        └── 5. Confirm → bookAppointment() → success redirect
```

---

## i18n Architecture

```
proxy.ts (middleware)
  └── next-international locale detection
        ├── URL prefix: /en/*, /fr/*
        └── Cookie/header fallback

providers/AppClientProvider.tsx
  └── I18nProviderClient wraps all client components

locales/
  ├── en.ts   (source of truth)
  └── fr.ts   (French translations)

Usage:
  Server: import { getI18n } from "@/locales/server"
  Client: import { useI18n } from "@/locales/client"
```

---

## Data Table Architecture

`components/common/data-table.tsx` is a reusable table powered by **TanStack Table 8**:

- Column definitions passed as props
- Built-in: sorting, column filtering, global search
- Pagination via `Pagination.tsx`
- Export: CSV (papaparse) and Excel (xlsx) download buttons
- Loading: `TableSkeleton` component
- Empty state: `Empty` component

---

## Role-Based Access

```
CurrentUser.roles → [ADMIN | DOCTOR | HOSPITAL | PATIENT]
        │
        ├── ADMIN    → Admin dashboard, full management
        ├── DOCTOR   → Availability, appointments, secretary
        ├── HOSPITAL → Hospital dashboard, doctor management
        └── PATIENT  → Book appointments, view history
```

Sidebar navigation (`app-sidebar.tsx`) reads role from `currentUser` and renders the appropriate nav items defined in `lib/constants.ts`.

---

## Module Dependency Graph

```
app/ (pages)
  └── imports → components/pages/
                    └── imports → components/common/ + components/ui/
                                      └── calls → actions/
                                                    └── uses → lib/api.ts
                                                                  └── calls → External API

hooks/
  └── uses → TanStack Query
               └── calls → actions/

providers/
  └── wraps → app layout
```

---

## Current Modules Status

| Module | Status | Location |
|---|---|---|
| Auth (Doctor/Hospital) | Complete | `actions/auth.actions.ts`, `components/pages/auth/` |
| Auth (Patient) | Complete | `components/pages/auth/PatientLogin.tsx` |
| Doctor Profile & Booking | Complete | `app/.../doctor/[userId]/`, `actions/doctor/booking.ts` |
| Doctor Availability | Complete | `app/.../availability/`, `actions/doctor/availability.ts` |
| Doctor Locations | Complete | `actions/doctor/location.ts`, `hooks/useLocations.ts` |
| Doctor Appointments | Complete | `actions/doctor/appointment.ts` |
| Global Search | Complete | `actions/search.ts`, `app/.../search/` |
| Hospital Module | Partial | `actions/hospital/hospitaldata.ts` |
| **Patient Module** | **In Progress** | `patient-module` branch |
| Admin Module | Partial | `components/pages/dashboard/AdminDashboardPage.tsx` |
| Messaging | Referenced only | `lib/constants.ts` |
| Secretary Management | Referenced only | `lib/constants.ts` |
