# Lessons Learned
## E-Commerce Art Gallery Platform

**Purpose:** Document corrections, mistakes, and learnings to avoid repeating them.

## 2026-02-11

- Registration tests failed because test emails used bracketed placeholder format (`'[email protected]'`), which is invalid for Laravel email validation. Use valid addresses like `user@example.com`.
- Password reset notification assertions should not access `$notification->user`; `Illuminate\Auth\Notifications\ResetPassword` only provides the token. Use the known user from outer scope (`use ($user)`).
- Use strong password fixtures in auth tests to reduce breakage when password default rules are tightened.
