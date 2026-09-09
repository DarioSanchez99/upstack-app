<div align="center">

# 📡 Upstack — API Monitoring

**SaaS platform for monitoring HTTP endpoints — real-time dashboards, alerts & billing**

![React](https://img.shields.io/badge/React%2018-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-635BFF?style=for-the-badge&logo=stripe&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

</div>

---

Upstack is a SaaS platform for monitoring HTTP endpoints. This repository contains the React frontend that connects to the Upstack API backend.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build tool | Vite 5 |
| Styling | Tailwind CSS + shadcn/ui |
| Routing | React Router v6 |
| Server state | TanStack Query v5 |
| Client state | Zustand |
| HTTP | Axios (JWT interceptor) |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| Toasts | Sonner |
| Icons | Lucide React |
| Deploy | Vercel |
| Domain | Hostinger DNS → Vercel |

---

## Prerequisites

- **Node.js 20+** (LTS recommended)
- **npm 10+** (bundled with Node 20)
- A running instance of the Upstack API backend

---

## Local Development Setup

```bash
# 1. Clone the repository
git clone https://github.com/your-org/upstack-app.git
cd upstack-app

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env and set VITE_API_URL to your backend URL

# 4. Start the dev server
npm run dev
```

The app will be available at [http://localhost:5173](http://localhost:5173).

---

## Environment Variables

| Variable | Description | Example |
|---|---|---|
| `VITE_API_URL` | Base URL of the Upstack API | `http://localhost:3000` |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key for billing | `pk_live_...` |

> All Vite env vars must be prefixed with `VITE_` to be accessible in the browser bundle.

---

## Folder Structure

```
src/
├── components/
│   ├── charts/          # ResponseTimeChart (Recharts)
│   ├── layout/          # AppLayout, Sidebar
│   ├── monitors/        # MonitorCard, MonitorForm, StatusBadge, UptimeBar
│   └── ui/              # shadcn/ui primitives (Button, Input, Card, Badge, Label)
├── hooks/
│   ├── useAuth.ts       # Login / register / logout
│   ├── useMonitors.ts   # TanStack Query hooks for monitors CRUD
│   └── useCheckResults.ts # Query hooks for check results & stats
├── lib/
│   ├── api.ts           # Axios instance with JWT interceptor
│   └── utils.ts         # cn() helper
├── pages/
│   ├── auth/            # Login, Register
│   ├── monitors/        # MonitorList, MonitorNew, MonitorDetail, MonitorEdit
│   ├── settings/        # Profile, Billing
│   ├── Dashboard.tsx
│   ├── StatusPage.tsx   # Public status page (/status/:slug)
│   └── NotFound.tsx
├── stores/
│   └── authStore.ts     # Zustand auth store (persisted)
├── types/
│   └── index.ts         # TypeScript interfaces & enums
├── App.tsx              # Router + route guards
├── main.tsx             # Entry point
└── index.css            # Tailwind + shadcn/ui CSS variables
```

---

## Pages and Routes

| Route | Page | Auth Required |
|---|---|---|
| `/` | Redirect to `/dashboard` or `/login` | — |
| `/login` | Login | No |
| `/register` | Register | No |
| `/dashboard` | Dashboard | Yes |
| `/monitors` | Monitor List | Yes |
| `/monitors/new` | Create Monitor | Yes |
| `/monitors/:id` | Monitor Detail | Yes |
| `/monitors/:id/edit` | Edit Monitor | Yes |
| `/settings` | Profile Settings | Yes |
| `/settings/billing` | Billing & Plans | Yes |
| `/status/:slug` | Public Status Page | No |
| `*` | 404 Not Found | — |

---

## Building for Production

```bash
npm run build
```

Output is placed in `dist/`. Preview the production build locally:

```bash
npm run preview
```

---

## Deploy to Vercel

### 1. Push to GitHub

```bash
git remote add origin https://github.com/your-org/upstack-app.git
git push -u origin main
```

### 2. Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in.
2. Click **Add New Project** → Import your GitHub repository.
3. Vercel auto-detects Vite. Leave **Framework Preset** as **Vite**.
4. Set **Build Command**: `npm run build`
5. Set **Output Directory**: `dist`

### 3. Set Environment Variables in Vercel

In the Vercel project → **Settings** → **Environment Variables**, add:

| Key | Value |
|---|---|
| `VITE_API_URL` | `https://api.yourdomain.com` |
| `VITE_STRIPE_PUBLISHABLE_KEY` | `pk_live_...` |

### 4. Deploy

Click **Deploy**. Vercel will build and deploy the project. Every push to `main` triggers an automatic redeploy.

---

## Custom Domain via Hostinger

### Step 1 — Add the domain in Vercel

1. In Vercel project → **Settings** → **Domains**.
2. Click **Add Domain** and enter your domain (e.g., `app.upstack.io`).
3. Vercel will show you the CNAME target: `cname.vercel-dns.com`.

### Step 2 — Add CNAME record in Hostinger

1. Log in to [Hostinger hPanel](https://hpanel.hostinger.com).
2. Go to **Domains** → your domain → **DNS / Nameservers**.
3. Add a **CNAME** record:
   - **Name / Host**: `app` (for `app.upstack.io`) or `@` for root
   - **Points to / Target**: `cname.vercel-dns.com`
   - **TTL**: `3600`
4. Save the record. DNS propagation takes up to 24h (usually a few minutes).

### Step 3 — Verify

Back in Vercel, click **Verify**. Once DNS propagates, SSL is automatically provisioned via Let's Encrypt.

---

## License

MIT
