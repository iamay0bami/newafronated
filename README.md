# Afronated — Landing Page

A creative media collective amplifying African voices through powerful storytelling, innovative media, and cultural excellence.

## Stack

- **React 18** + **Vite 6**
- **TypeScript**
- **Tailwind CSS v4**
- **Framer Motion** (via `motion`)
- **React Router v7**
- **shadcn/ui** components

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Build

```bash
npm run build
npm run preview   # preview the production build locally
```

## Deploy to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project** → import your repo
3. Framework preset: **Vite** (auto-detected)
4. Build command: `npm run build`
5. Output directory: `dist`
6. Click **Deploy** ✓

The included `vercel.json` handles SPA routing so all pages (`/submit`, `/partner`, `/privacy`, `/terms`) work correctly on refresh.

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home — Hero, Mission, Interviews, Team |
| `/submit` | "Put Me On" submission form |
| `/partner` | Partnership enquiries |
| `/privacy` | Privacy Policy |
| `/terms` | Terms of Service |

## Customisation

- **Brand colour** (red `#ef4444`) — search-replace across `/src/app/components/` and `/src/app/pages/`
- **Logos** — replace `public/logo.png` and `public/logo-preloader.png`
- **Team members** — edit the `teamMembers` array in `src/app/components/Team.tsx`
- **Videos** — edit the `videos` array in `src/app/components/Interviews.tsx`
