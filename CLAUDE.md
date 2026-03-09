# CLAUDE.md - FBMP

Facebook Marketplace listing tool. Capture items on phone, enhance with AI, post via Chrome automation.

## Stack
- Next.js 15 + Tailwind v4 + App Router
- Neon Postgres via Drizzle ORM
- Vercel Blob for image storage
- Deployed on Vercel

## Key Paths
- `src/db/schema.ts` — Drizzle schema (products table)
- `src/app/page.tsx` — Mobile capture form
- `src/app/products/` — Product grid + detail/edit
- `src/app/api/` — REST API (products CRUD + image upload)

## API
- `GET /api/products` — List all (optional `?status=draft`)
- `POST /api/products` — Create (JSON body)
- `GET /api/products/:id` — Get one
- `PATCH /api/products/:id` — Update fields
- `DELETE /api/products/:id` — Delete
- `POST /api/upload` — Multipart image upload → Vercel Blob URLs

## Product Statuses
- `draft` — Captured, not enhanced
- `enhanced` — AI-processed title/desc/price
- `posted` — Listed on FB Marketplace
- `sold` — Sold and done

## CC Skills
Skills live at `~/.claude/commands/fbmp/`:
- `/fbmp:list` — Show all products
- `/fbmp:enhance` — AI-enhance a product
- `/fbmp:post` — Post to FB via Chrome automation
- `/fbmp:status` — Dashboard summary

## DB Migrations
```bash
npx drizzle-kit generate  # Generate migration
npx drizzle-kit push       # Push schema to Neon
```
