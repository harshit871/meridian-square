# CubeSquare — Property Listing Experience
**Frontend Developer (React/TypeScript) — Stage 2 Practical Assessment**  
**MeridianSquare.Global**

A real-world asset (RWA) tokenization property marketplace built with **React**, **TypeScript** (strict mode), **Bootstrap 5 (Sass)**, and **TanStack Query**.

---

## Quick Start

Run with a single command:

```bash
npm install && npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Tech Stack & Architecture

- **Framework:** React 18 / 19 with Vite
- **Language:** TypeScript with strict mode enabled (`noImplicitAny`, `strictNullChecks`, typed props across all components, zero `any`)
- **Theme & Styling:** Bootstrap 5 compiled via Sass (`src/styles/theme.scss`). No Tailwind, CSS Modules, or secondary styling frameworks.
- **State & Data Fetching:** TanStack Query (`@tanstack/react-query`) with query key factories and derived filtering via `select`.
- **Testing & Quality:** Vitest, React Testing Library, ESLint, and Stylelint (`stylelint-declaration-strict-value`).

---

## Core Components

### 1. `PropertyCard` (`src/components/PropertyCard.tsx`)
Reusable card accepting strongly typed props:
- Property name, location, price per token, total token supply, and projected yield.
- **Data-driven availability indicator:** Dynamically calculates `(availableTokens / totalSupply) * 100`. When remaining tokens are below 20%, a high-urgency badge (`badge text-bg-danger`) is displayed with the exact percentage remaining.
  - *Marina Tower Unit 4B:* 180 / 1,000 = 18.0% &rarr; **High Demand indicator active**
  - *Downtown Loft 12A:* 498 / 500 = 99.6% &rarr; **Normal display**
  - *JVC Studio Block C:* 12 / 2,000 = 0.6% &rarr; **High Demand indicator active**
- **View Property CTA:** Opens an interactive investment summary modal.

### 2. `PropertyListingPage` (`src/components/PropertyListingPage.tsx`)
Page consuming `PropertyCard` and handling data fetching and layout:
- **Responsive Bootstrap Grid:** 3 columns on desktop (`>=992px`), 2 columns on tablet (`768px–991px`), and 1 column on mobile (`<768px`) via `row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4`.
- **Filter Panel (`src/components/FilterPanel.tsx`):** Location select dropdown + minimum yield numeric input + reset action.
- **Explicit Lifecycle States:**
  - *Loading:* Skeleton placeholder cards (`placeholder-glow`) matching the card dimensions to prevent layout shifts.
  - *Error:* Danger alert card displaying error details with an active **Retry Fetch** button.
  - *Empty:* Dedicated empty-state card when filter criteria return zero results, with a **Clear All Filters** shortcut.

### 3. `KYCStatusBanner` (`src/components/KYCStatusBanner.tsx`)
Mounted above the listing to display investor KYC status:
- `pending`: Amber banner (`alert alert-warning`) with text:  
  *"Your identity verification is in progress. You can browse but cannot invest yet."*
- `rejected`: Red banner (`alert alert-danger`) with text:  
  *"Your identity verification was unsuccessful. Please contact support."*
- `approved`: Renders `null` (no DOM footprint).
- Colors are inherited strictly from Bootstrap's contextual color palette (`warning`, `danger`) with no hardcoded hex overrides.

---

## Reviewer Controls (Demo Mode)

To make evaluating edge cases simple without editing code, a demo toolbar is embedded in the top navbar:

| Control | Options | What to Observe |
|---|---|---|
| **KYC** | `Pending`, `Rejected`, `Approved` | Toggles the contextual amber banner, red banner, or hides it completely. |
| **API** | `Normal`, `Slow (2s)`, `Error (500)` | Simulates network latency to inspect skeleton loading states, or triggers a 500 failure to test the error card and retry flow. |

---

## Bootstrap Theme Governance

The platform maintains a single source of truth for design tokens:

1. **Theme Entry Point (`src/styles/theme.scss`):**  
   Bootstrap variables are overridden *before* importing Bootstrap:
   - `$primary: #1A3A5C` (brand navy)
   - `$border-radius: 0.5rem` (8px base radius)
   - `$font-family-base: 'Inter', sans-serif`
2. **Zero Component CSS Drift:**  
   Components use compiled Bootstrap semantic classes and utility tokens. There are zero component-level CSS files with hardcoded hex codes or pixel radii.
3. **Automated PR Enforcement:**  
   `.stylelintrc.json` is configured with `stylelint-declaration-strict-value` and `color-no-hex: true`. Running `npm run lint:style` fails if any raw colors or non-tokenized dimension values are introduced.

---

## Deliverables

- **[CSS Governance Note (`CSS_GOVERNANCE.md`)](CSS_GOVERNANCE.md):** 234 words on theme structure, PR-level enforcement, and white-label multi-client operator strategy.
- **[AI Usage Review (`AI_USAGE_REVIEW.md`)](AI_USAGE_REVIEW.md):** 420 words covering tools used, key prompts, accepted scaffolding, and critical engineering corrections.

---

## Verification & Available Scripts

```bash
# Start local dev server with HMR
npm run dev

# Run Vitest component & integration test suite
npm run test

# Run Stylelint to verify zero hardcoded theme values
npm run lint:style

# Build production bundle and run TypeScript typecheck
npm run build
```

### Test Suite Overview (`src/test/`)
- `PropertyCard.test.tsx`: Field rendering, dynamic `<20%` urgency badge toggling, and button click handlers.
- `KYCStatusBanner.test.tsx`: Correct copy and Bootstrap contextual classes for `pending`, `rejected`, and `approved`.
- `PropertyListingPage.test.tsx`: Location filtering, yield numeric filtering, skeleton loading, empty state, and error/retry lifecycle.
