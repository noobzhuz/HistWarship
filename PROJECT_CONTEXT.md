# Project Context

This document answers one question: what does a new AI coding assistant need to know to immediately continue development on Warship Explorer?

It is not a PRD, README, changelog, or complete project encyclopedia. Keep it focused on current implementation context and durable engineering decisions.

## 1. Project Overview

Warship Explorer is a Next.js + TypeScript discovery app for preserved historic naval vessels and the museum sites that care for them.

The core domain distinction is:

- Ships are the main content entities users want to discover and read about.
- Museum sites are geographic places and points of interest. Map markers represent museum sites/POIs, not individual ships.

The current app supports browsing seeded museum sites and ships, exploring them on a Leaflet map, searching across both entity types, and previewing read-only community content from the database.

## 2. Source Of Truth

- `prisma/schema.prisma` = database/data model truth
- `docs/PRD_EN.md` = product direction and V1/V2/V3 intent
- `PROJECT_CONTEXT.md` = current implementation context
- `README.md` = setup, commands, and basic usage
- Git history = detailed change history

When documents disagree, prefer the schema for implemented data shape, the code for implemented behavior, the PRD for product direction, and this file for current development context.

## 3. Current Development Phase

Current milestone: V1 discovery foundation.

Completed milestones:

- Database schema for users, museum sites, ships, posts, tags, comments, and edit proposals.
- Seeded development dataset for initial sites, ships, tags, demo user, and demo community posts.
- Database-backed home page, map page, ship detail pages, site detail pages, and community preview page.
- Combined search API and client search UI for museum sites and ships.
- Leaflet map showing museum-site markers with ship links.
- Enriched ship and museum-site detail pages using existing schema fields for visitor planning, status, deeper descriptions, and sources.

Immediate next priorities:

- Continue UI polish for map/search/detail pages.
- Expand curated content and imagery beyond the representative enriched seed records.
- Decide the first authenticated workflow before enabling posting, commenting, uploads, or edit proposals.
- Replace placeholder images/content where better curated assets are available.

Intentionally deferred:

- Ratings and popularity rankings.
- Check-ins, visited tracking, and public collection mechanics.
- AI translation.
- User image uploads.
- Full moderation tooling.

## 4. Current Repository Health

Current repository status:

- Builds successfully
- Lint passes
- Prisma migration complete
- Supabase integration complete
- Database-backed pages implemented
- Mock data removed
- Seed data verified

The repository is currently considered stable. New work should build incrementally on the existing architecture rather than introducing broad refactors.

## 5. Product Principles

Keep implementation aligned with these product rules:

- Discovery comes before popularity.
- Casual visitors should feel welcome; the UI should not assume naval expertise.
- Map markers represent museum sites/POIs, never individual ships.
- Search must support both museum sites and ships.
- Ship search results should lead directly to ship pages.
- Guests can browse, search, and read.
- Users must log in before posting, commenting, uploading, or submitting edits.
- V1 should not implement ratings, check-ins, visited tracking, or AI translation.

## 6. Current Architecture

The app currently uses:

- Next.js App Router with server components for database-backed pages.
- TypeScript throughout the app.
- Prisma Client against PostgreSQL-compatible database configuration.
- Supabase/PostgreSQL as the target database environment.
- Leaflet/react-leaflet for map rendering.
- Tailwind CSS and shadcn-style local UI components.
- Next.js API routes for client-triggered search.

Several pages export `dynamic = "force-dynamic"` because they read live database state through Prisma.

## 7. Architecture Decisions

Prisma is server-side only.

Client Components must not import Prisma. Prisma access belongs in server pages, API routes, or server-side data helpers under `lib/`. This prevents database code from leaking into browser bundles and keeps credentials server-only.

Search uses an API route.

The search input is client-side and calls `/api/search`. The API route performs Prisma queries and returns serialized site/ship results. This keeps search interactive while preserving the server-only Prisma boundary.

Leaflet receives serialized plain data.

Map data is loaded server-side through `getMapSites()`, converted into plain values, and passed into client map components. Decimal coordinates are converted to numbers before reaching Leaflet.

Seed data lives only under `prisma/`.

Development seed records are defined in `prisma/seed-data.ts`; the mapping/upsert logic is in `prisma/seed.ts`. Avoid scattering seed fixtures through app code.

Museum site markers aggregate ships at a location.

The map uses one marker per museum site and shows linked ships in the popup. Do not add per-ship map markers unless the product model changes explicitly.

## 8. Repository Structure

Brief orientation:

- `app/`: App Router pages and API routes.
- `components/`: UI, layout, search, home, and map components.
- `lib/`: Prisma client and server-side data helpers.
- `prisma/`: schema, migrations, seed script, and seed records.
- `docs/`: product planning documents.
- `public/`: static placeholder assets.

Keep detailed setup instructions in `README.md`, not here.

## 9. Current Implementation Status

Currently implemented:

- `/`: database-backed home page with map hero, embedded combined search, random discovery list, and community preview.
- `/map`: full Leaflet map showing museum-site markers and marker popups with ship links.
- `/sites/[slug]`: database-backed museum site page with hero, location, about content, visitor planning information, accessibility notes, visit duration, visit status, an external location link, ships present, and sources when available.
- `/ships/[slug]`: database-backed ship page with hero, summary, expanded facts, overview, why-visit content, visit status, visitor notes, history, technical information, sources, museum site link, and a placeholder discussions section.
- `/community`: database-backed read-only preview of published discussion/trip-report posts. It explicitly states posting is not active.
- `/api/search`: combined museum-site and ship search endpoint.

Not currently implemented:

- Authentication UI/workflows.
- User posting, commenting, uploads, or edit proposal submission.
- Real moderation tools.
- Production image management through Supabase Storage.

## 10. Database Overview

Current Prisma model groups:

- `UserProfile`: app profile record keyed by Supabase-style UUID, with role.
- `MuseumSite`: geographic POI/container for one or more ships.
- `Ship`: primary vessel content entity, required to belong to a museum site.
- `Post`, `PostTag`, `Comment`: community content model.
- `EditProposal`: proposed changes/new records requiring review.

Important enums include user roles, ship types, open status, preservation status, post type, content status, review status, and edit target type.

The schema already anticipates more product surface than the UI currently exposes.

## 11. Frontend Overview

The frontend is organized around App Router pages and reusable components.

Current notable components:

- `components/home/map-hero.tsx`: home-page map/search/discovery experience.
- `components/home/hero-search.tsx`: search input wrapper.
- `components/search/search-results.tsx`: client search results UI backed by `/api/search`.
- `components/map/map-loader.tsx`: client-only dynamic Leaflet loader.
- `components/map/atlas-map.tsx`: Leaflet map, markers, popups, labels, zoom behavior.
- `components/ui/*`: local shadcn-style primitives.

The design direction should stay friendly, readable, and useful for casual visitors.

## 12. Backend Overview

Current backend behavior is mostly server-rendered data access plus one API route:

- `lib/prisma.ts` creates/reuses the Prisma client.
- `lib/map-data.ts` loads serialized map site data.
- `lib/home-data.ts` loads random discovery ships and community preview posts.
- `lib/community-data.ts` loads community page posts.
- `app/api/search/route.ts` handles combined site/ship search.
- Ship and site detail pages query Prisma directly in server components.

Supabase Auth and Supabase Storage are part of the intended stack, but user-facing auth/storage flows are not currently implemented.

## 13. Community State

The database schema supports community content, but the product surface is currently read-only.

Currently implemented:

- Posts can be associated with ships, museum sites, or neither.
- Posts support `DISCUSSION`, `ARTICLE`, and `TRIP_REPORT` types.
- Comments and nested replies exist in the schema.
- Seeded demo posts appear in home/community previews.

Not currently implemented:

- Creating posts.
- Commenting.
- Editing/deleting community content in the UI.
- Moderation interfaces.
- Auth-gated participation.

Demo-labeled posts are development preview content, not real community activity.

## 14. Seed Strategy

Seed data is for local/development preview only.

- `prisma/seed-data.ts` contains the canonical seed records for current development.
- `prisma/seed.ts` maps those records into Prisma models using upserts.
- Seed data currently includes 7 museum sites and 9 ships.
- USS Massachusetts is the representative enriched ship record, and Battleship Cove is the representative enriched museum-site record used to verify deeper detail-page content.
- Seed logic also creates tags, one demo user, and demo community posts.
- Placeholder images currently point to `/placeholder-site.svg` and `/placeholder-ship.svg`.

Do not treat seed data as production truth. It exists to keep development screens populated and test the current domain model.

## 15. Development Roadmap

Near-term V1 work should focus on completing discovery rather than expanding into social features too early:

- Continue expanding curated ship and site content beyond the representative enriched records.
- Improve map browsing, search ergonomics, and mobile polish.
- Refine practical visitor information as reliable source material becomes available.
- Clarify auth architecture before enabling community write actions.
- Add source attribution and official links where available.

Deferred V2+ items include user image uploads, AI translation, edit proposal UI, larger moderation tools, and personal collections. Personal collections should not become public rankings.

## 16. Known Technical Debt

Current known gaps to remember:

- `heroImageUrl` is used, but most seed records still point to placeholder SVGs.
- Most seed records remain sparse; USS Massachusetts and Battleship Cove are the representative enriched verification records.
- `galleryImages` exists in the schema but is not surfaced in the UI.
- Ship technical information renders supported scalar values, including year-like numbers without thousands separators.
- Map filters are not implemented.
- Search has basic substring matching; alternate-name array matching is exact.
- Community UI remains preview/read-only despite the broader schema, and some panels retain placeholder-oriented copy for later phases.
- Auth, uploads, posting, commenting, edit proposal submission, moderation, and production storage workflows are not wired into the UI.
- Ratings, rankings, visited tracking, AI translation, and per-ship map markers remain intentionally excluded.
- `docs/PRD_CN.md` appears encoding-corrupted/mojibake in the current checkout.

Mention these gaps when relevant, but do not fix them opportunistically unless they are in scope for the current task.

## 17. AI Collaboration Workflow
Before starting any feature:

1. Read PROJECT_CONTEXT.md.
2. Read the relevant PRD section.
3. Inspect the existing implementation.
4. Produce an implementation plan.
5. Wait for approval before editing.

Preferred workflow:

Plan -> Review -> Implement -> Verify -> Accept -> Commit

Guidelines for AI coding assistants:

- Prefer small, reviewable changes.
- Preserve existing behavior unless the user asks to change it.
- Avoid unnecessary refactoring.
- Keep implementation scope tied to the current task.
- Read the relevant files before editing.
- Use existing project patterns before introducing new abstractions.
- Distinguish implemented behavior from roadmap intent.
- Update this file when architecture, implementation state, or durable workflow assumptions change.

Do not commit unless the user explicitly asks for a commit.

## 18. Maintenance Policy

Keep this document concise and current-state focused.

Update this file when:

- The current development phase changes.
- Routes or major user flows are added/removed.
- The Prisma schema changes in a way future work must understand.
- Important architecture decisions are made or reversed.
- Known technical debt is resolved or new durable debt is introduced.
- The AI collaboration workflow changes.

When uncertain:

- Prefer preserving existing architecture over introducing a theoretically better abstraction.
- Incremental consistency is preferred over large-scale rewrites.
- Solve the current task without expanding scope unnecessarily.

Do not duplicate:

- Setup commands from `README.md`.
- Dependency/version details from `package.json`.
- Full product requirements from the PRD.
- Detailed historical changes from Git history.



When a note becomes stale, remove or rewrite it. This file should stay useful for the next assistant, not accumulate archaeological layers.
