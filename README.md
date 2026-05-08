# Afronated

Afronated is a creative media collective built around amplifying African voices. The website is the central hub for everything we do — from our interview series and short-form content to our editorial work, team, and community.

The site is designed to feel as intentional as the brand itself. Fast, dark, bold, and built to let the work speak.

---

## What's on the site

**Home** — The full picture. Hero reel, our mission, featured interviews, YouTube Shorts, TikTok feed, Medium articles, Instagram mosaic, and the team.

**Spotlight Interviews** — Conversations with African creatives doing real things. Musicians, filmmakers, entrepreneurs, stylists. The "Behind The Creative" series lives here.

**Put Me On** — A submission form for creatives who want to be featured, collaborate, or just get on our radar.

**Partner** — For brands, agencies, and organisations interested in working with us on content, events, or campaigns.

**Careers** — Roles within the collective — both paid and contributor positions across production, content, and strategy.

**Privacy & Terms** — Standard legal pages, written clearly.

---

## Stack

- React 18 + Vite 6
- TypeScript
- Tailwind CSS v4
- Framer Motion
- React Router v7
- shadcn/ui

---

## Running locally

```bash
npm install
npm run dev
```

Opens at [http://localhost:5173](http://localhost:5173)

---

## Build and deploy

```bash
npm run build
npm run preview
```

Deployed on Vercel. The `vercel.json` file handles SPA routing so all pages work correctly on refresh.

---

## Customisation notes

- Brand colour is `#ef4444` — search across `/src/app/components/` and `/src/app/pages/` to update
- Team members — edit the `teamMembers` array in `src/app/components/Team.tsx`
- Interview videos — edit `HARDCODED_VIDEOS` in `src/app/components/Interviews.tsx` or let the YouTube API pull them dynamically
- TikTok videos — update `TIKTOK_VIDEOS` in `src/app/components/TikTokDrop.tsx`
- Logos — replace `public/logo.png` and `public/logo-preloader.png`