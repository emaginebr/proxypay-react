# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**proxypay-react** is a React component library (NPM package) for payment processing — PIX QR codes, invoices, and recurring billings. It ships as ES + CJS with TypeScript declarations. An `example-app/` demonstrates the library in a full admin dashboard with authentication.

## Build & Dev Commands

### Library (root)
```bash
npm run build          # vite build → dist/ (ESM + CJS)
npm run dev            # vite build --watch
npm run typecheck      # tsc --noEmit
npm run lint           # eslint src/
```

### Example App (example-app/)
```bash
cd example-app
npm run dev            # vite dev server
npm run build          # tsc -b && vite build (typecheck + production build)
npm run lint           # eslint .
```

## Architecture

### Library (`src/`)

Follows the **types → services → contexts → hooks → components** pattern:

- `types/payment.ts` — All TypeScript interfaces, enums, and component props
- `services/proxyPayService.ts` — Class-based API client; receives `ProxyPayConfig` (baseUrl, clientId, tenantId) via `configure()`
- `contexts/ProxyPayContext.tsx` — Instantiates a service per provider, exposes methods via context
- `hooks/useProxyPay.ts` — Typed context consumer with null-check
- `components/` — `PixPayment` (modal + polling), `InvoicePayment`, `BillingPayment` (redirect-based)
- `index.ts` — Public API surface; all exports come from here

The library uses `X-Tenant-Id` header for multi-tenancy. No bearer token — authentication is the consumer's responsibility.

### Example App (`example-app/src/`)

Same layered architecture per entity:

| Entity | Service | Context | Hook | Pages |
|--------|---------|---------|------|-------|
| Store | storeService (REST + GraphQL) | StoreContext | useStore | StorePage, Dashboard |
| Customer | customerService (GraphQL) | CustomerContext | useCustomer | CustomersPage |
| Invoice | invoiceService (GraphQL) | InvoiceContext | useInvoice | InvoicesPage |
| Billing | billingService (GraphQL) | BillingContext | useBilling | BillingsPage |
| Balance | balanceService (GraphQL) | BalanceContext | useBalance | Dashboard |

- `services/apiHelpers.ts` — Shared `getHeaders(token)`, `handleResponse<T>`, `graphql<T>` helpers
- Authentication via `nauth-react` (NAuthProvider); token passed to services
- Provider chain in `main.tsx`: NAuth → Store → Balance → Customer → Invoice → Billing

### API Conventions

- REST API documented in `docs/API_DOCUMENTATION.md`
- GraphQL endpoint at `{API_BASE_URL}/graphql` for read operations (myStore, myCustomers, myInvoices, myBillings, myBalance, myTransactions)
- REST endpoints for mutations (store CRUD, payment creation)
- Headers: `Authorization: Bearer {token}` + `X-Tenant-Id` for authenticated requests

## Environment Variables (example-app)

```
VITE_API_BASE_URL     # Backend API URL
VITE_NAUTH_API_URL    # Auth service URL
VITE_CLIENT_ID        # ProxyPay client identifier
VITE_TENANT_ID        # Multi-tenant identifier
```

## Key Patterns

- **Service classes** export both a singleton instance (`camelCase`) and the class (`default`). Services have private `handleResponse` method.
- **Contexts** always include `loading`, `error`, and main data state. All methods wrapped in `useCallback`.
- **Hooks** throw if used outside their provider.
- **Library public API** must remain stable — changes to `src/index.ts` exports are breaking changes.
- The library has **no runtime dependencies** — only React as peer dependency.
