# Portfolio — Frontend

Personal portfolio built with **Next.js 16** (App Router), **React 19**, **TypeScript**, and **Tailwind CSS 4**.

This is the frontend. The backend (NestJS API) lives in a separate repository.

## Getting started

```bash
npm install
cp .env.example .env.local   # then edit values
npm run dev                  # http://localhost:3000
```

## Structure

```
src/
├── app/                 # Routes, layout, global styles (App Router)
├── components/
│   ├── ui/              # Reusable presentational components (Container, …)
│   └── sections/        # Page sections (Hero, Projects, Contact)
├── data/                # Static content (projects, …) — swap for API calls later
├── lib/
│   ├── api.ts           # Typed fetch client for the backend
│   └── utils.ts         # Helpers (cn, …)
└── types/               # Shared TypeScript types
```

## Environment

| Variable              | Description                                  |
| --------------------- | -------------------------------------------- |
| `NEXT_PUBLIC_API_URL` | Base URL of the backend API (no trailing /). |

See `.env.example`.

## Deployment

Deploy on **Vercel** (native Next.js support). Set `NEXT_PUBLIC_API_URL` in the
Vercel project's environment variables to your deployed backend URL.

## Scripts

| Command         | Description                |
| --------------- | -------------------------- |
| `npm run dev`   | Start dev server           |
| `npm run build` | Production build           |
| `npm run start` | Serve the production build |
| `npm run lint`  | Run ESLint                 |
