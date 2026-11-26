# Contributing

## Set up

Node 22 (see `.nvmrc`) and pnpm (`corepack enable`), then:

```bash
pnpm install
pnpm check
```

## Before you open a pull request

- [ ] `pnpm check` passes (types, lint, formatting, tests, build)
- [ ] A new test for every new rule
- [ ] No secrets in the diff
- [ ] `docs/` and `CHANGELOG.md` updated

## Conventions

- Short branches from `main`: `feat/`, `fix/`, `docs/`, `perf/`, `ops/`.
- [Conventional Commits](https://www.conventionalcommits.org/); the body explains why.
- Comments explain why, not what.
- Decisions that are hard to undo get an ADR in `docs/adr/`.
