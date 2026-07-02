# Warship Explorer

A Next.js discovery experience for preserved naval vessels and the museum sites that care for them.

The app uses the Next.js App Router with Prisma-backed data from Supabase/PostgreSQL. Development seed data lives in `prisma/seed.ts` and `prisma/seed-data.ts`.

## Included routes

- `/` - home, featured content, and combined site/ship search
- `/map` - full Leaflet map with museum-site POI markers
- `/sites/[slug]` - museum site details and ships present
- `/ships/[slug]` - individual preserved ship details
- `/community` - read-only community placeholder

Map markers represent museum sites, never individual vessels. Search results include both sites and ships.

## Local setup

Install Node.js 20.9 or newer, then run:

```powershell
Copy-Item .env.example .env
npm install
npx prisma generate
npx prisma migrate dev
npx prisma db seed
npm run dev
```

Open `http://localhost:3000`.

## Checks

```powershell
npm run lint
npm run build
```

Useful manual checks:

- Search for `USS Salem`, `USS Lionfish`, `Balao`, `Boston`, or `HMS Belfast`.
- Confirm Battleship Cove has one map marker and links to both USS Massachusetts and USS Lionfish.
- Open every marker and verify that its popup links to a museum site.
- Check the layouts at mobile and desktop widths.
