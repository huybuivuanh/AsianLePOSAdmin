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

```
src/
├── app/                    # Next.js App Router
│   ├── (app)/              # Protected route group (auth-gated layout)
│   └── api/users/          # Server-side user management (firebase-admin)
├── features/               # Domain feature modules
│   ├── credits/            # CreditList, CreditTableRow, Create/UpdateCreditForm
│   ├── customers/          # CustomerList
│   ├── menu/
│   │   ├── categories/     # CategoriesList, CategoriesTab, Create/Update/AddItem forms
│   │   ├── items/          # ItemList, ItemCard, ItemsTab, Create/Update/AddOptionGroup forms
│   │   ├── option-groups/  # OptionGroupList, OptionGroupCard, OptionGroupsTab, forms
│   │   ├── options/        # OptionList, OptionsTab, Create/UpdateOptionForm
│   │   └── publish/        # PublishMenuToolbar
│   ├── menu-changes/       # MenuChangeList, Create/UpdateMenuChangeForm
│   ├── orders/             # OrderHistoryView, OrderCard, OrderItemBlock
│   ├── tables/             # DashboardTablesSection, EditTableDialog, AddTableDialog
│   └── users/              # UserList, Create/UpdateUserForm
├── stores/                 # Zustand stores, one per domain
├── providers/              # AuthProvider
├── services/               # userService (calls Next.js API routes)
├── lib/                    # Shared utilities
│   ├── firebase-config.ts  # Firebase client SDK init
│   ├── firebase-admin.ts   # Firebase Admin SDK init
│   ├── firestore-timestamp.ts
│   ├── formatters.ts       # formatCurrency, formatTimestamp, formatOrderedAt, etc.
│   ├── list-utils.ts       # matchesQuery, sortByAlphabet, sortByNameAndCreated
│   ├── menu-item-option-groups.ts
│   ├── option-group-updates.ts
│   ├── order-history-firestore.ts
│   └── utils.ts            # cn() helper
├── components/
│   ├── ui/                 # Radix UI primitives (Button, Dialog, Input, etc.)
│   └── layout/             # Navbar, PageHeader
└── types/
    ├── index.ts            # Barrel re-export (import from here)
    ├── enum.ts             # Enums (OrderStatus, KitchenType, etc.)
    ├── order.types.ts
    ├── menu.types.ts
    ├── user.types.ts
    ├── credit.types.ts
    ├── customer.types.ts
    └── table.types.ts
```

### Data flow

Two data-access patterns co-exist:

1. **Client → Firestore directly**: Zustand stores open `onSnapshot` listeners for real-time updates. Components read store state and call store actions.
2. **Client → API route → firebase-admin → Firestore**: Used for privileged operations (user management). `src/services/` calls `POST /api/users/*`; the API route uses the admin SDK.

### Store subscriptions

Stores are subscribed per-route in layout files under `src/app/(app)/`. Each route layout subscribes only to the stores it needs via a `useEffect` keyed on `[loading, user]`. Every Zustand store exposes a `subscribe(): () => void` method that returns its `onSnapshot` unsubscribe. When adding a new store, expose `subscribe` on it, then add it to the relevant route layout(s). Do not subscribe to stores inside feature components.

### Auth

Firebase Auth with custom claims for role-based access. `AuthProvider` persists session and exposes user + role via `useAuth()`. Protected routes check auth state in the `(app)` layout.

### Conventions

- All interactive/stateful components are Client Components (`"use client"`).
- Path alias `@/` maps to `src/`.
- Tailwind v4 with `clsx` + `tailwind-merge` via `cn()` for conditional classes.
- Firebase credentials live in `.env.local` (not tracked).
- **Types**: always import from `@/types` (the barrel). Never import from a domain type file directly.
- **Formatting**: use helpers from `@/lib/formatters` (`formatTimestamp`, `formatCurrency`, etc.) — never inline `toLocaleString()` or `.toFixed(2)` directly in components.
- **Search/sort**: use `matchesQuery` and `sortByNameAndCreated` from `@/lib/list-utils`.
- **List components**: keep them thin — search state + filter + a loop. Extract per-item display into a `*Card` or `*Row` component that calls the store directly.
- **Dialogs**: each dialog component owns its own loading/saving state and handlers. Pass only the minimal data needed (e.g. the selected entity) as props.
