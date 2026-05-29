# Asian Le POS Admin

Internal admin panel for the Asian Le point-of-sale system. Manages menu, tables, credits, customers, order history, and staff users. Built with Next.js 15 and Firebase.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router, Turbopack) |
| UI | React 19, Tailwind CSS v4, Radix UI |
| State | Zustand with Firestore `onSnapshot` |
| Database | Firebase Firestore |
| Auth | Firebase Auth (custom claims, role-based) |
| Server ops | Firebase Admin SDK via Next.js API routes |
| Drag & drop | dnd-kit |

## Getting Started

### Prerequisites

- Node.js 18+
- A Firebase project with Firestore and Authentication enabled

### Environment variables

Create `.env.local` in the project root:

```env
# Firebase client SDK
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Firebase Admin SDK (server-side only)
FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY=
```

### Running locally

```bash
npm install
npm run dev      # http://localhost:3000
```

### Other commands

```bash
npm run build    # Production build
npm run lint     # ESLint
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages and API routes
│   ├── (app)/              # Auth-protected pages (menu, orders, credits, etc.)
│   └── api/users/          # Privileged user management endpoints
├── features/               # UI grouped by domain
│   ├── credits/
│   ├── customers/
│   ├── menu/
│   │   ├── categories/
│   │   ├── items/
│   │   ├── option-groups/
│   │   ├── options/
│   │   └── publish/
│   ├── menu-changes/
│   ├── orders/
│   ├── tables/
│   └── users/
├── stores/                 # Zustand stores (one per domain)
├── providers/              # AuthProvider, StoreProvider
├── services/               # HTTP calls to internal API routes
├── lib/                    # Shared utilities
├── components/             # Shared UI components
└── types/                  # TypeScript types split by domain
```

## Key Patterns

### Real-time data

Zustand stores open Firestore `onSnapshot` listeners via a `subscribe()` method. All stores are started centrally in `StoreProvider` — components just read from the store, they never subscribe themselves.

```ts
// Reading store state in a component
const { credits, loading } = useCreditStore();
```

### Privileged operations

User management (create, update, delete, role assignment) goes through Next.js API routes that use the Firebase Admin SDK. All other Firestore writes happen client-side via store actions.

### Adding a new feature

1. **Type** — add a domain type file in `src/types/` and re-export from `src/types/index.ts`
2. **Store** — create `src/stores/useXStore.ts` with a `subscribe()` method; add it to `StoreProvider`
3. **Feature** — create `src/features/<domain>/` with list, card/row, and form components
4. **Page** — add a page under `src/app/(app)/<route>/page.tsx`

### Formatting helpers (`src/lib/formatters.ts`)

| Function | Use for |
|----------|---------|
| `formatTimestamp(value)` | Firestore Timestamp → locale string, safe for legacy docs |
| `formatCurrency(amount)` | `$x.xx` display |
| `formatOrderedAt(date)` | Date with month/day/year/time |
| `formatDiscountLabel(discount)` | Discount type + value label |
| `formatDiscountAmount(discount)` | Formatted discount amount string |
| `formatReadyIn(fulfillment)` | Takeout ready-in display |

### List utilities (`src/lib/list-utils.ts`)

| Function | Use for |
|----------|---------|
| `matchesQuery(q, ...fields)` | Client-side search across string fields |
| `sortByAlphabet(array)` | Alphabetical sort (used in stores on snapshot) |
| `sortByNameAndCreated(rows, sortBy, nameSort, createdSort)` | Two-column sortable table |

## Features

| Page | Description |
|------|-------------|
| `/menu` | Manage categories, items, option groups, and options. Publish to POS. |
| `/orders` | View order history by date and channel (dine-in / takeout) |
| `/credits` | Manage customer credit entries |
| `/customers` | View customers synced from the POS |
| `/menu-changes` | Track item substitution records |
| `/users` | Manage staff accounts and roles |
| `/dashboard` | Table overview and management |
