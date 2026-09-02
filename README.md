# The System

Private house ledger for David Hunt’s movie night. Friends only.

Repo: https://github.com/mry84/the-system
Vercel: https://the-system-mark-young-s-projects.vercel.app

Git is the source. Vercel deploys `main`.

## Stack

Next.js App Router + Prisma + Tailwind. Local SQLite. Production needs Neon Postgres (`DATABASE_URL`).

## Local

```bash
npm install
npx prisma db push
SKIP_ARTWORK=1 npm run db:seed
npm run dev
```

## Roster

David Hunt, Jason Wolf, Matt Potts, Mark Young, Matt Stauffacher, John Stauffacher, Michael Ralston, Slate Brown, Jamie Hunt, Shook.
