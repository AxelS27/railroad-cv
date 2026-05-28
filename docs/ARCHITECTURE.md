# Architecture

## Monorepo Layout

```
apps/
  web/      → frontend (Next.js App Router + Tailwind + shadcn/ui)
  server/   → backend / API (Hono on Node.js + Zod)
packages/
  ui/       → shared design system & components (shadcn/ui lives here)
  types/    → shared Zod schemas + inferred TS types
  utils/    → pure, framework-agnostic helpers
  config/   → shared tsconfig / eslint / prettier config
huggingface/
  README.md → model card or Space documentation
  app.py    → optional Hugging Face Space entrypoint
  models/   → model weights/checkpoints, ignored by normal GitHub pushes
  artifacts/→ exported model artifacts, ignored by normal GitHub pushes
```

Managed with **pnpm workspaces** + **Turborepo**. Run tasks from root via `turbo`.

Internal packages are consumed **as TypeScript source** (their `exports` point at `src/`), so there's no separate build step. Next.js must list workspace packages it imports in `transpilePackages` (e.g. `['@repo/ui', '@repo/types', '@repo/utils']`).

Frontend rendering, data-fetching, performance, and design-craft rules live in **`docs/FRONTEND.md`** - open it for any `apps/web` work.

## Frontend / Backend Separation

- `apps/web` and `apps/server` are fully independent deployables.
- They communicate **only** over the API defined in `docs/API.md`.
- No shared runtime imports between them - shared code goes through `packages/*`.

## Package Responsibilities

| Package | Owns | Rule |
|---------|------|------|
| `packages/ui` | shadcn/ui components, design tokens | No business logic |
| `packages/types` | Zod schemas + inferred contracts | Schemas + types only, no app logic |
| `packages/utils` | Pure functions | No framework / no side effects |
| `packages/config` | tsconfig / eslint / prettier bases | Extended, not edited per-app |

## Feature-Based Architecture

Inside each app, group by **feature**, not by file type:

```
features/
  auth/
    components/
    hooks/
    services/
    types/
    index.ts   ← public surface of the feature
```

A feature exposes only what's in its `index.ts`. Internals stay private.

## Import Boundaries

- Apps → may import from `packages/*`.
- Packages → **never** import from apps.
- Feature → **never** imports a sibling feature's internals. Cross-feature sharing goes up to `components/shared`, `lib`, or a `package`.

## Naming Conventions

| Thing | Convention | Example |
|-------|-----------|---------|
| Files/folders | kebab-case | `user-profile.ts` |
| Components | PascalCase | `UserProfile` |
| Functions/vars | camelCase | `getUser` |
| Constants | SCREAMING_SNAKE_CASE | `MAX_RETRIES` |
| Types/Interfaces | PascalCase | `UserDto` |

## Data Flow

```
web (Next.js Server/Client Components)
  → web/services (typed fetch to the API)
  → server (Hono: routes → modules → services)
  → Supabase (PostgreSQL · Auth · Storage)
```

Request/response shapes are **Zod schemas in `packages/types`**; both apps import them, so frontend and backend can't drift - the server validates with the schema, the client infers its types from it.

## Supabase Clients

- **Web** (`apps/web/src/lib`): browser/SSR client built with `@supabase/ssr` using the **anon key** only. Subject to Row Level Security.
- **Server** (`apps/server/src/lib`): client with the **service-role key** for trusted operations. Never expose this key to the browser or any `NEXT_PUBLIC_*` var.
- Enable **RLS on every table**. The anon key being public is safe *only* because RLS is on.

## Large AI Models

Only relevant when a project actually uses large models.

- Models run on **Hugging Face** (Inference API for shared models, Inference Endpoints for dedicated/private ones) - **never** loaded into the Node process or shipped to the browser.
- The integration lives in `apps/server/src/services`; the web app calls the server, the server calls Hugging Face. Auth via `HUGGINGFACE_API_KEY` (server-only).
- Custom model handoff lives in root `huggingface/`. See `huggingface/README.md` for upload notes and artifact handling.
