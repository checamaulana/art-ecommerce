# Lessons Learned
## E-Commerce Art Gallery Platform

**Purpose:** Document corrections, mistakes, and learnings to avoid repeating them.

## 2026-02-11

- Registration tests failed because test emails used bracketed placeholder format (`'[email protected]'`), which is invalid for Laravel email validation. Use valid addresses like `user@example.com`.
- Password reset notification assertions should not access `$notification->user`; `Illuminate\Auth\Notifications\ResetPassword` only provides the token. Use the known user from outer scope (`use ($user)`).
- Use strong password fixtures in auth tests to reduce breakage when password default rules are tightened.

## 2026-02-12

- In `resources/js/app.tsx`, import local setup files from the same folder with `./` (example: `./lib/i18n`), not `../`.
- Keep frontend imports aligned with project structure and aliases (`@/components/ui/*`, `@/components/common/*`) to avoid Vite pre-transform resolution errors.
- With Tailwind v4 and semantic tokens, define `--color-*` mappings in `@theme inline` for variables like `background`, `foreground`, and `border`; otherwise classes such as `border-border` are treated as unknown utilities.
- When using `route()` in React without Ziggy installed, initialize a global route helper before app render (or migrate to Wayfinder imports) to avoid runtime `ReferenceError: route is not defined` and blank page.
- Avoid importing packages that are not in `package.json` (example: `react-icons/fa`) because Vite module resolution failure can cascade into a white screen.
- Laravel `paginate()` payload for Inertia is a flat paginator object with `links` array at the top level; using API Resource-style `meta.links` in frontend causes `undefined` crashes.
