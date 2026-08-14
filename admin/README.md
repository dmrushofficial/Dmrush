# DM Rush Admin (IMS Portal)

Existing Vite + Express student management admin panel, mounted at **`/admin`** on dmrush.com.

## Do not redesign

This app is integrated as-is. Only base-path / routing / API mount changes were made for `/admin`.

## Local development

Run **two processes**:

```bash
# Terminal A — marketing site (port 3000)
ADMIN_INTERNAL_URL=http://127.0.0.1:3005 npm run dev

# Terminal B — admin panel (port 3005)
ADMIN_PORT=3005 npm run dev:admin
```

Then open:

- Website: http://localhost:3000
- Admin (via Next proxy): http://localhost:3000/admin
- Admin login: http://localhost:3000/admin/login
- Admin direct: http://localhost:3005/admin

> Note: Learn (`dmrush-learn`) often uses port 3001. Admin defaults to **3005** to avoid that clash.

### Default login (from seed db)

- Admin: `admin@dmrush.com` / `admin`
- Accountant: `accountant@dmrush.com` / `accountant`

## Production

1. Build admin: `npm run build:admin`
2. Start admin: `NODE_ENV=production npm run start:admin` (listens on `ADMIN_PORT`, default `3001`)
3. Point Next `ADMIN_INTERNAL_URL` at that service, **or** put a reverse proxy in front:

```
/admin      → admin Node service
/admin/api  → admin Node service
/*          → Next.js website
```

## Environment

See `.env.example` in this folder and root `dmrush/.env.example` (`ADMIN_INTERNAL_URL`).
