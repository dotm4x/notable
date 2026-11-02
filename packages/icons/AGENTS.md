# AGENTS.md — One Icons

This package is the icon implementation of One. Icons are generated from SVG assets and JSON metadata under `source/icons/svg/`.

Follow root AGENTS.md and `packages/components/AGENTS.md` where applicable.

## Source of truth
- `source/icons/svg/<icon>/icon.svg` and `icon.json` are authoritative.
- `source/icons/components/` and `source/generated.ts` are generated. Never edit manually.
- Run `pnpm run generate` after changing sources.

## Guidelines
- Follow `docs/guidelines/foundations/icons.md`.
- Icons are 24x24, 2px stroke, round caps/joins, single color `currentColor`.
- Keep artwork in 20x20 safe area.

## Generation
- Use `pnpm run clean`, `pnpm run generate`, `pnpm run typecheck`, `pnpm run build`.
- Validate metadata against `metadata.schema.json` with Ajv.
- Do not delete existing components unless identified as generated.

## Naming
- Icon directories: kebab-case.
- Components: PascalCase.
- Types prefixed with T if added.

## Verification
- Run `pnpm test` and `pnpm build` before completion.
EOF