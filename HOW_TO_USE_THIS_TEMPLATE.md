# How to Use This Template

Internal guide for starting a new project from this monorepo template. The public `README.md` is a non-technical overview of whatever you build.

## What this is

An AI-native, production-grade monorepo template optimized for AI coding agents (Claude Code and Codex). Documentation-first, low-noise, strict-architecture. Copy the folder, fill the docs, build.

For stack decisions and rationale, read `docs/DECISIONS.md`. For folder boundaries, read `docs/ARCHITECTURE.md`. For frontend rules, read `docs/FRONTEND.md`.

## Start a new project

1. Copy this folder to the new project location, or create a new repo from the GitHub template.
2. Rename `#.gitignore` to `.gitignore`.
3. `pnpm install`
4. Copy `.env.example` to `.env` and fill in the values.
5. Fill `docs/PRD.md` with what you are building.
6. `pnpm dev`

## How AI agents work here

Read `AGENTS.md` first. It is the daily workflow source of truth and points to the right `docs/*` file when a task needs deeper detail.

## Before publishing a product repo

After you use this template for a real product, the public repo should read as a normal, human-made project:

- Replace `README.md` with a non-technical overview of your product: description and screenshots, no internals.
- Keep local agent folders out of Git after `#.gitignore` has been renamed to `.gitignore`.
- Keep commit messages short and human, with no AI-agent references.
