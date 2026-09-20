# CSS Governance & Architecture Note

### Bootstrap 5 Theme Structure
We established a single source of truth in `src/styles/theme.scss`, overriding Bootstrap Sass variables (`$primary: #1A3A5C`, `$border-radius: 0.5rem`, `$font-family-base: 'Inter'`) before importing Bootstrap. Components never define raw design values; they consume compiled Bootstrap utilities (`card`, `btn-primary`, `badge text-bg-danger`, `alert-warning`). Contextual colors drive alert states without custom CSS overrides, preventing shadow design systems.

### PR-Level Enforcement
At the pull request level, we enforce design compliance through automated tooling and developer discipline:
1. **Stylelint Automation:** Configured `stylelint-declaration-strict-value` with `color-no-hex: true` to block raw hex colors, font declarations, and arbitrary pixel measurements in component styles.
2. **CI Gates:** GitHub Actions run `npm run lint:style` and `npm run build`, automatically rejecting PRs with unapproved CSS overrides.
3. **Review Checklist:** Code reviews verify that UI states reuse existing Bootstrap tokens and utility classes before considering custom styling.

### White-Label Theming for Multiple Operator Clients
To support multiple real-world asset operators without fragmenting the component codebase:
1. **Uncoupled Components:** All React components rely strictly on semantic Bootstrap classes and CSS custom properties (`--bs-primary`, `--bs-border-radius`).
2. **Tenant Token Entry Points:** Each operator client receives a dedicated theme file (e.g., `theme.client-a.scss`, `theme.client-b.scss`) declaring brand colors, fonts, and radii.
3. **Dynamic Compilation / Multi-Tenancy:** At build or runtime, tenant tokens map into CSS custom properties or compile into dedicated bundles. Components remain 100% untouched while brand identity changes entirely through the theme layer.
