# How to Use This Template

Internal guide for starting a new project from this monorepo. This file is git-ignored: it stays local and travels by folder-copy, never to GitHub. The public `README.md` is a non-technical overview of whatever you build.

## What this is

An AI-native, production-grade monorepo template optimized for AI coding agents (Claude Code and Codex). Documentation-first, low-noise, strict-architecture. Copy the folder, fill the docs, build.

## Stack

| Layer | Choice |
|-------|--------|
| Monorepo | pnpm, Turborepo, TypeScript |
| Frontend | Next.js (App Router), React, Tailwind CSS, shadcn/ui |
| Backend | Node.js, Hono, Zod |
| Database / Auth / Storage | Supabase (PostgreSQL) |
| Deploy | Vercel (Docker optional) |
| Large AI models | Hugging Face (when needed) |

Rationale for each choice is in `docs/DECISIONS.md`.

## Structure

```
apps/
  web/        Frontend (Next.js + Tailwind + shadcn/ui)
  server/     Backend / API (Hono + Zod)
packages/
  ui/         Shared design system & components (shadcn/ui)
  types/      Shared Zod schemas + inferred types (request/response contracts)
  utils/      Pure, framework-agnostic helpers
  config/     Shared tsconfig / eslint / prettier config
docs/         PRD, architecture, decisions, API, quality (local only)
AGENTS.md     AI instruction system, read first (local only)
CLAUDE.md     Redirect to AGENTS.md (local only)
```

User-facing text for `apps/web` lives in `apps/web/src/i18n/locales` (one file per language). See `docs/FRONTEND.md`.

## Start a new project

1. Copy this folder to the new project location. Do not `git clone`: the agent and template files are git-ignored and would not come along.
2. `pnpm install`
3. `cp .env.example .env` and fill in the values.
4. Fill `docs/PRD.md` with what you are building.
5. `pnpm dev`

## How AI agents work here

1. Read `AGENTS.md` first. It is self-contained for daily work.
2. Open a `docs/*` file only when the task needs that specific detail.
3. Reuse from `packages/` before writing new code.
4. Keep `apps/web` and `apps/server` boundaries clean.
5. Log major decisions in `docs/DECISIONS.md`, and check the Definition of Done in `docs/QUALITY.md` before finishing.

## Before pushing to GitHub

The public repo should read as a normal, human-made project:

- Replace `README.md` with a non-technical overview of your product: description and screenshots, no internals.
- Agent and template files are git-ignored already (`.claude/`, `.codex/`, `AGENTS.md`, `CLAUDE.md`, `docs/`, this file). Confirm `git status` does not show them.
- Keep commit messages short and human, with no AI-agent references.
