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
│   ├── (app)/              # Protected route group (auth-gated layout: Navbar + AppModal)
│   │   ├── (standard)/     # Full-width pages: dashboard (/), orders, tables, customers, credits, users, …
│   │   └── menu/           # Collapsible sidebar + /menu/{categories,items,option-groups,options}
│   ├── login/              # Sign-in page
│   └── api/users/          # Server-side user management (firebase-admin)
├── features/               # Domain feature modules (named exports, file name = component name)
│   ├── add-extras/         # AddExtraList, Create/UpdateAddExtraForm
│   ├── credits/            # CreditList, CreditTableRow, Create/UpdateCreditForm
│   ├── customers/          # CustomerList, CustomerTableRow, Create/UpdateCustomerForm
│   ├── menu/
│   │   ├── categories/     # CategoriesSection, CategoryList, Create/UpdateCategoryForm, SortCategoriesForm, AddCategoryItemsForm
│   │   ├── items/          # ItemsSection, ItemList, ItemCard, Create/UpdateItemForm, AddItemOptionGroupsForm, SortOptionGroupsForm
│   │   ├── option-groups/  # OptionGroupsSection, OptionGroupList, OptionGroupCard, Create/UpdateOptionGroupForm, AddGroupOptionsForm
│   │   ├── options/        # OptionsSection, OptionList, Create/UpdateOptionForm
│   │   ├── publish/        # PublishMenuToolbar
│   │   └── MenuSidebar.tsx
│   ├── menu-changes/       # MenuChangeList, MenuChangeCard, menu change + item change forms
│   ├── orders/             # OrderHistoryView, OrderCard, OrderItemBlock, RewardsBadge
│   ├── rewards/            # RewardsSignInCard (dashboard)
│   ├── tables/             # TablesSection, AddTableDialog, EditTableDialog
│   └── users/              # UserList, Create/UpdateUserForm
├── stores/                 # Zustand stores, one per domain (+ useModalStore for popups)
├── providers/              # AuthProvider
├── services/               # userService (calls Next.js API routes), rewardsService (Rewards Cloud Functions)
├── lib/                    # Shared utilities and Firestore helpers
│   ├── firebase-config.ts  # Firebase client SDK init (+ demo database switch)
│   ├── firebase-admin.ts   # Firebase Admin SDK init
│   ├── rewards-firebase.ts # Second Firebase app for the Rewards project
│   ├── linked-writes.ts    # Atomic (batched) writes for linked menu docs
│   ├── order-history-firestore.ts  # Order queries + print/paid/complete/cancel writes
│   ├── order-loyalty.ts    # Reverses rewards points on cancel
│   ├── order-calculations.ts  # orderItemsSubtotal, calculateTaxBreakdown (same math as POS)
│   ├── rewards-badge.ts    # Rewards badge text (same as POS)
│   ├── formatters.ts       # formatCurrency, formatTimestamp, formatOrderedAt, etc.
│   ├── list-utils.ts       # matchesQuery, sortCustomers, sortByNameAndCreated
│   ├── menu-item-option-groups.ts
│   ├── option-group-updates.ts
│   ├── firestore-timestamp.ts
│   ├── demo.ts
│   └── utils.ts            # cn() helper
├── components/
│   ├── ui/                 # Radix UI primitives (Button, Dialog, Input, Select, …)
│   └── layout/             # Navbar, PageHeader, SectionSidebar, RowParts, AppModal
└── types/
    ├── global.d.ts         # All domain interfaces, declared globally (no import needed)
    └── enum.ts             # Enums (OrderStatus, KitchenType, etc.) — runtime values, import from @/types/enum
```

### Data flow

Two data-access patterns co-exist:

1. **Client → Firestore directly**: Zustand stores open `onSnapshot` listeners for real-time updates. Components read store state and call store actions.
2. **Client → API route → firebase-admin → Firestore**: Used for privileged operations (user management). `src/services/` calls `POST /api/users/*`; the API route uses the admin SDK.

### Store subscriptions

Stores are subscribed per-route in layout files under `src/app/(app)/`. Each route layout subscribes only to the stores it needs via a `useEffect` keyed on `[loading, user]`. Every Zustand store exposes a `subscribe(): () => void` method that returns its `onSnapshot` unsubscribe. When adding a new store, expose `subscribe` on it, then add it to the relevant route layout(s). Do not subscribe to stores inside feature components.

### Rewards

A second Firebase app connects to the Asian Le Rewards project (`NEXT_PUBLIC_REWARDS_FIREBASE_*`). Each browser signs in once as the shared POS account (role: "pos") from the Dashboard page; the login is separate from the admin login. Cancelling an order calls the Rewards `reverseOrder` function (skipped on the demo database).

### Auth

Firebase Auth with custom claims for role-based access. `AuthProvider` persists session and exposes user + role via `useAuth()`. Protected routes check auth state in the `(app)` layout.

### Conventions

- All interactive/stateful components are Client Components (`"use client"`).
- Feature components use named exports and the file name matches the component name. Only route files (`page.tsx`, `layout.tsx`) use default exports.
- Path alias `@/` maps to `src/`.
- Tailwind v4 with `clsx` + `tailwind-merge` via `cn()` for conditional classes.
- Firebase credentials live in `.env.local` (not tracked).
- **Types**: domain interfaces live in `src/types/global.d.ts` under `declare global` — use them directly without importing. Enums are runtime values, so import them from `@/types/enum`.
- **Formatting**: use helpers from `@/lib/formatters` (`formatTimestamp`, `formatCurrency`, etc.) — never inline `toLocaleString()` or `.toFixed(2)` directly in components.
- **Search/sort**: use `matchesQuery` and `sortByNameAndCreated` from `@/lib/list-utils`.
- **List components**: keep them thin — search state + filter + a loop. Extract per-item display into a `*Card` or `*Row` component that calls the store directly.
- **Dialogs**: each dialog component owns its own loading/saving state and handlers. Pass only the minimal data needed (e.g. the selected entity) as props.
- **UI style** (matches asian-le-website-admin): page header = `PageHeader` (title + count + actions). List rows use `rowCardClass` / `rowHeaderClass` / `RowActions` (Edit + red Delete) / `RemoveButton` / `EmptyState` from `@/components/layout/RowParts`. Brand colors `ink`, `gold`, `on-ink` live in `globals.css`.
- **Linked menu data**: categories ↔ items, items ↔ option groups, option groups ↔ options keep id lists on both sides. Change or delete them only through `@/lib/linked-writes` (one Firestore batch each), never with two separate store calls.
- **Popups**: never use `window.alert` / `window.confirm`. Use `alertDialog` / `confirmDialog` from `@/stores/useModalStore` (`{ danger: true, confirmLabel: "Delete" }` for deletes).
