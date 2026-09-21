# CubeSquare — Property Listing Experience

**Frontend Developer (React/TypeScript) — Stage 2 Practical Assessment**  
MeridianSquare.Global

A real-world asset tokenization property marketplace built with React, TypeScript (strict), Bootstrap 5 (Sass), and TanStack Query.

---

## Quick Start

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

---

## Scripts

```bash
npm run dev        # Vite dev server with HMR
npm run build      # TypeScript typecheck + production bundle
npm run test       # Vitest component and integration tests
npm run lint       # ESLint (TypeScript)
npm run lint:style # Stylelint (CSS/Scss governance)
```

---

## Architecture

```
src/
├── api/
│   ├── mockData.ts         # Three fixed test properties from the spec
│   └── propertiesApi.ts    # Async fetchProperties() with simulation modes
├── hooks/
│   └── useProperties.ts    # TanStack Query hook + client-side filter via select()
├── components/
│   ├── PropertyCard.tsx     # Reusable card — accepts property: Property
│   ├── KYCStatusBanner.tsx  # Contextual alert banner driven by KYC status
│   ├── FilterPanel.tsx      # Location + min yield filters
│   ├── PropertyListingPage.tsx
│   └── Header.tsx           # Demo controls for reviewers
├── styles/
│   └── theme.scss           # Bootstrap Sass variable overrides — single source of truth
└── types/
    ├── property.ts
    └── kyc.ts
```

---

## State Management

**Server state** lives in TanStack Query (`propertyKeys.all`). The query key does not include the reviewer API simulation mode — that is a testing concern, not a product cache dimension.

**Filter state** is local `useState` in `PropertyListingPage`. Filtering is derived from the cached query result via `select()`. There is no duplicate state.

---

## Bootstrap Theme Governance

All design tokens are defined in `src/styles/theme.scss` before the Bootstrap import:

- `$primary: #1A3A5C`
- `$border-radius: 0.5rem`
- `$font-family-base: 'Inter', sans-serif`

Components use Bootstrap semantic utilities (`btn-primary`, `alert-warning`, `badge text-bg-danger`). No component file contains hardcoded hex values or pixel radii. Stylelint enforces this automatically — see [`CSS_GOVERNANCE.md`](CSS_GOVERNANCE.md).

---

## Reviewer Controls

The header exposes two demo dropdowns, kept visually secondary:

| Control | Options | What it demonstrates |
|---|---|---|
| **KYC** | Pending / Rejected / Approved | All three banner states |
| **API** | Normal / Slow (2s) / Error (500) | Skeleton loading, error card, and retry flow |

---

## Testing

Three test files covering the highest-value business behaviours:

- **`PropertyCard.test.tsx`** — field rendering, `< 20%` urgency badge toggling (all three spec properties), button click handler
- **`KYCStatusBanner.test.tsx`** — correct copy and Bootstrap contextual classes for all three KYC states
- **`PropertyListingPage.test.tsx`** — location filter, yield filter, empty state, error/retry flow

---

## Timebox Note

Implemented within the 3–4 hour assessment window. Architecture deliberately favors explainability over abstraction — the code path from data to render is short and linear.
