# Yeshtery Auth App (Interview Task)

Implements the required login -> dashboard flow with:
- Next.js 14 (App Router)
- HTTP-only cookie for access token
- Call to `/v1/yeshtery/token` then `/v1/user/info`
- Zustand for minimal client state (stores `{id, name}` after login)
- Validation rules (disabled button + inline errors)
- Logout that clears cookies
- Middleware to guard `/dashboard`

## Quick Start

```bash
pnpm i   # or npm i / yarn
pnpm dev # or npm run dev
# open http://localhost:3000
```

The login form is prefilled with the provided credentials:
- E-Mail: `dev.aert@gmail.com`
- Password: `helloworld`

## Notes

- Token is stored as `access_token` (HttpOnly, Secure, SameSite=Lax, 1h).
- User info (`id`, `name`) is stored in readable cookies (`user_id`, `user_name`) and also returned from the `/api/login` call to hydrate Zustand on the client.
- Visiting `/` checks freshness by calling `GET /v1/user/info`. If valid, redirects to `/dashboard`, else `/login`.
- Visiting `/login` while logged in redirects to `/dashboard` (middleware). Visiting `/dashboard` without a token redirects to `/login`.
- Styling is simple but in a distinct layout from login vs dashboard to meet the "different layout" requirement.
- No JWT parsing is done; backend 401 indicates invalid/expired token as per the brief.
- Code is organized for clarity; feel free to adapt to match any specific Figma spacing/colors.
- Push this folder to a public GitHub repo to submit.
