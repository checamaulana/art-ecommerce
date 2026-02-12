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
- For slug fields derived from names and used as route keys, regenerate the slug on `updating` (not only `creating`) so renamed records stay routable.
- Avoid low-cardinality sources with `fake()->unique()` in factories (like fixed arrays of 10 values); use high-cardinality generators to prevent `Maximum retries of 10000` overflow.
- `UploadedFile::fake()->image()` requires PHP GD; in environments without GD, skip that specific test conditionally instead of failing the whole suite.
- Products are intentionally soft-deleted in this project; admin delete tests should assert `assertSoftDeleted` unless the requirement explicitly asks for permanent deletion.
- Inertia feature tests validate component existence; when controller returns a new component path, ensure matching file exists under `resources/js/pages/...`.
- If an Eloquent model overrides `getRouteKeyName()` to `slug`, frontend route generation must send the slug (not numeric ID), or implicit binding will return `404 Not Found`.
- For custom frontend `route()` helpers with multi-segment parameters, pass named objects (`{ product: slug, image: id }`) instead of positional arrays to avoid missing route parameter errors.
- If slug is derived from product title and used for route model binding, regenerate slug on `updating` when `title` changes, not only on `creating`.
- When slug changes during update, avoid `return back()` from edit routes because it can redirect to stale slug URLs; redirect to a named route with the updated model key.
- `delete()` on models using `SoftDeletes` does not remove DB rows; use `forceDelete()` when business rules require permanent deletion.
- Wishlist routes with `{product}` also follow product route key binding (`slug` in this project), so using numeric `id` in frontend route params will return 404.
