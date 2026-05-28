# Quality

## Code Quality
- Strict TypeScript (`strict: true`, no implicit `any`).
- Lint + format must pass before commit (`turbo lint`).
- One responsibility per file; functions do one thing.
- No dead code, no commented-out blocks, no `console.log` in committed code.

## UI Consistency
- Frontend rendering, performance & design-craft rules: see `docs/FRONTEND.md`. The bar is "professionally designed, human-made" — never AI-generic.
- All UI built from `packages/ui` primitives — no one-off styled elements.
- Use design tokens (spacing, color, radius) — never hardcoded values.
- Responsive by default; test at mobile + desktop widths.

## Performance Basics
- No unnecessary re-renders (memoize where it measurably helps, not preemptively).
- Lazy-load routes/heavy components.
- Server: paginate list endpoints; never return unbounded results.

## Security Basics
- Validate every external input at the boundary with **Zod** (route handlers) before any logic runs.
- Never trust client data; never expose secrets to the frontend.
- `.env` is git-ignored; commit only `.env.example`.
- Parameterized DB queries only — no string-built SQL.
- **Supabase:** enable Row Level Security on every table. The anon key (`NEXT_PUBLIC_*`) may be public; the **service-role key is server-only** and must never reach `apps/web`.
- **AI models:** call Hugging Face from `apps/server` only; keep `HUGGINGFACE_API_KEY` off the client.

## Definition of Done
A task is done when:
- [ ] Works as specified in PRD / task
- [ ] Tests written and passing (logic + edge cases)
- [ ] Lint + typecheck clean
- [ ] Matches naming & folder conventions (ARCHITECTURE.md)
- [ ] API matches `docs/API.md` (if applicable)
- [ ] Relevant doc updated if its domain changed
