# Quality

## Code Quality
- Strict TypeScript (`strict: true`, no implicit `any`).
- Lint + format must pass before commit (`turbo lint`).
- One responsibility per file; functions do one thing.
- No dead code, no commented-out blocks, no `console.log` in committed code.

## UI Consistency
- Frontend rendering, performance & design-craft rules: see `docs/FRONTEND.md`. The bar is "professionally designed, human-made" - never AI-generic. UI work is not done until its **Done gate** self-audit passes.
- Use shared UI primitives and design tokens before creating one-off styles.
- Test responsive behavior at mobile and desktop widths.

## Performance Basics
- No unnecessary re-renders (memoize where it measurably helps, not preemptively).
- Lazy-load routes/heavy components.
- Server: paginate list endpoints; never return unbounded results.

## Security Basics
- Validate every external input at the boundary with **Zod** (route handlers) before any logic runs.
- Never trust client data or expose secrets to the frontend.
- After `#.gitignore` is renamed to `.gitignore` in a product repo, commit only `.env.example`, not `.env`.
- Parameterized DB queries only - no string-built SQL.
- **Supabase:** enable Row Level Security on every table.
- **AI models:** call hosted models from `apps/server` only.

## Definition of Done
A task is done when:
- [ ] Works as specified in PRD / task
- [ ] Tests written and passing (logic + edge cases)
- [ ] Lint + typecheck clean
- [ ] UI work: the **Done gate** self-audit in `docs/FRONTEND.md` is written and every check passes
- [ ] Matches naming & folder conventions (ARCHITECTURE.md)
- [ ] API matches `docs/API.md` (if applicable)
- [ ] Relevant doc updated if its domain changed
