# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (Next.js + Turbopack)
npm run build    # Production build
npm run lint     # Run ESLint
```

## Architecture

**Stack**: Next.js 15 App Router, React 19, TypeScript, Firebase (Firestore + Auth), Zustand, Tailwind CSS v4, Radix UI, dnd-kit.

### Folder layout

- `src/app/` — App Router pages and API routes. Pages live under `(app)/` group. API routes under `api/` use firebase-admin for privileged server-side ops.
- `src/features/` — Domain modules (credits, menu, customers, orders, users). Each feature contains its own form/list components.
- `src/stores/` — Zustand stores, one per domain. Stores subscribe to Firestore `onSnapshot` listeners and expose loading/error states alongside CRUD methods.
- `src/services/` — HTTP-level service functions (e.g. `userService`) that call the Next.js API routes via `fetch`.
- `src/providers/` — `AuthProvider` wraps the app, calls `onAuthStateChanged`, and exposes `useAuth()`.
- `src/lib/` — Firebase client config, Firestore timestamp helpers, `cn()` utility.
- `src/types/` — Shared TypeScript types.
- `src/components/ui/` — Radix UI-based primitives. `src/components/layout/` — Navbar, PageHeader.

### Data flow

Two data-access patterns co-exist:

1. **Client → Firestore directly**: Zustand stores open `onSnapshot` listeners for real-time updates. Components read store state and call store actions.
2. **Client → API route → firebase-admin → Firestore**: Used for privileged operations (user management). `src/services/` calls `POST /api/users/*`; the API route uses the admin SDK.

### Auth

Firebase Auth with custom claims for role-based access. `AuthProvider` (`src/providers/`) persists session and exposes user + role via `useAuth()`. Protected routes check auth state in the `(app)` layout.

### Conventions

- All interactive/stateful components are Client Components (`"use client"`).
- Path alias `@/` maps to `src/`.
- Tailwind v4 with `clsx` + `tailwind-merge` via `cn()` for conditional classes.
- Firebase credentials live in `.env.local` (not tracked).
