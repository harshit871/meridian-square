# AI Usage Review & Technical Audit

### Tools Used
I used Claude 3.5 Sonnet and ChatGPT (GPT-4o) to accelerate component scaffolding, cross-check Bootstrap 5 Sass variable overrides, and audit TanStack Query v5 state management patterns.

### Key Prompts Used
1. *"Generate a Vite + React + TypeScript setup with Bootstrap 5 Sass variable overrides ($primary: #1A3A5C, border radius, font-family), ensuring zero hardcoded colors exist in components."*
2. *"Write a TanStack Query v5 hook fetching mock properties from GET /properties, implementing client-side filtering via the select option and explicit loading/error states."*
3. *"Create a reusable PropertyCard component in React with typed props and a dynamic indicator triggered when available tokens fall below 20% of total supply."*
4. *"Configure Stylelint with stylelint-declaration-strict-value to strictly enforce that no raw hex colors or arbitrary pixel values are written in component files."*

### Review of AI Output: What Was Accepted
The AI was effective at quickly generating the initial boilerplate for Vite, TypeScript interfaces, and standard Bootstrap grid structure (`row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4`). It also correctly suggested using Bootstrap's `placeholder-glow` and `placeholder` classes for skeleton cards rather than a generic blank spinner, aligning with the requirement for explicit loading states.

### Critical Corrections & Engineering Overrides

1. **Enforcing Strict Data-Driven Availability Logic:**  
   The AI initially generated a hardcoded threshold (`availableTokens < 200`) or attempted to style low availability with a static CSS class. I corrected this to compute `(availableTokens / totalSupply) * 100 < 20` dynamically. This ensures that Marina Tower (18.0%) and JVC Studio (0.6%) trigger the indicator, while Downtown Loft (99.6%) does not, driven entirely by data.

2. **TanStack Query State Separation:**  
   The AI initially attempted to store filtered properties in a secondary `useState` hook, duplicating server state into local state. I rejected this anti-pattern and implemented TanStack Query’s `select` transformation function. This keeps server caching clean under `['properties', 'list']` while deriving filtered views reactively without redundant network calls.

3. **Eliminating Shadow Theme Overrides:**  
   The AI repeatedly suggested custom CSS helper classes with hardcoded `#1A3A5C` or custom pixel paddings for the card and button elements. I purged all custom component CSS, replacing them with standard Bootstrap contextual utility classes (`badge text-bg-danger`, `alert-warning`, `alert-danger`, `btn btn-primary`), ensuring total compliance with the single source of truth in `theme.scss`.

4. **Reviewer Evaluation Tooling:**  
   The AI did not provide a way for reviewers to test all state transitions without editing code. I added reviewer controls in the header to dynamically toggle KYC status (`pending`, `rejected`, `approved`) and API latency/errors (`normal`, `slow`, `error`), making verification seamless.
