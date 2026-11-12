# Yeshtery Auth App

A compact **login → dashboard** authentication flow built for a front-end interview
task. It demonstrates secure, cookie-based session handling in the Next.js App Router
with guarded routes and minimal client state.

🔗 **Live demo:** https://login-task-crud.vercel.app

## Features

- **Email/password login** against the Yeshtery API (`/v1/yeshtery/token` → `/v1/user/info`).
- **HttpOnly cookie sessions** — the access token is stored in a `Secure`, `SameSite=Lax`, HttpOnly cookie (1h).
- **Route guarding** — middleware protects `/dashboard`; visiting `/login` while authenticated redirects to `/dashboard`.
- **Freshness check** — visiting `/` validates the session via `GET /v1/user/info` and routes accordingly.
- **Minimal client state** — Zustand holds `{ id, name }` after login; readable `user_*` cookies hydrate it on the client.
- **Form validation** — disabled submit button with inline error messages.
- **Logout** — clears auth cookies.

## Tech stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router) + React 18
- **Language:** TypeScript
- **State:** [Zustand](https://github.com/pmndrs/zustand)
- **Auth:** HttpOnly cookies + Next.js middleware

The upstream API base URL is defined in [`lib/auth.ts`](./lib/auth.ts)
(`https://api-yeshtery.dev.meetusvr.com`) — a public endpoint provided for the task,
so no environment variables are required to run it.

## Getting started

```bash
npm install      # or pnpm i / yarn
npm run dev
# open http://localhost:3000
```

The login form is prefilled with the task-provided test credentials
(`dev.aert@gmail.com` / `helloworld`).

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm run start` | Start the production server |
| `npm run lint` | Run the linter |

## How it works

- Token stored as `access_token` (HttpOnly, Secure, SameSite=Lax, 1h expiry).
- `id` and `name` are stored in readable cookies (`user_id`, `user_name`) and returned
  from `/api/login` to hydrate Zustand on the client.
- `/dashboard` without a valid token redirects to `/login`; a backend `401` indicates
  an invalid/expired token (no client-side JWT parsing).

> Built as an interview task; layouts for the login and dashboard views are intentionally distinct.
