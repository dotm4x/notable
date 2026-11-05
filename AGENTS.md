# AGENTS.md

One is a design language for creating expressive, coherent, accessible, and thoughtfully crafted digital experiences.

It is not a single component library, framework, or platform-specific implementation. It defines shared principles, foundations, patterns, and component guidance that multiple implementations realize in their own platforms. This repository contains the design language, its implementations, the site that documents them, and the tooling that supports them.

These instructions apply to the whole repository. They define repo-wide rules without prescribing the technology used by any single area.

## 1. Instruction hierarchy

- This file applies everywhere in the repository.
- Area instructions add rules for their area: `docs/guidelines/AGENTS.md`, `packages/one/AGENTS.md`, and `apps/site/AGENTS.md`.
- The closest applicable instruction file wins on scope. A more specific file refines this one; it must not contradict it.
- `docs/guidelines/` is the authority for design decisions. If an instruction and a guideline conflict, investigate the intent and report the conflict instead of choosing arbitrarily.
- Report unresolved ambiguity. Do not invent a convention to fill a gap.

## 2. Repository map

| Area                 | Path                                              | Package       | Responsibility                                                                     |
| -------------------- | ------------------------------------------------- | ------------- | ---------------------------------------------------------------------------------- |
| Design language      | `docs/guidelines/`                                | —             | Principles, foundations, patterns, and component guidance. Technology-independent. |
| React implementation | `packages/one/`                                   | `@dotm4x/one` | Components, styles, icons, tests, and stories.                                     |
| Documentation site   | `apps/site/`                                      | `@one/site`   | Next.js site that renders the guidelines and component documentation.              |
| Repository tooling   | root config, `.github/`, `.husky/`, `.changeset/` | —             | Workspace scripts, CI, release, and quality gates.                                 |

Responsibilities are conceptual boundaries. Inspect a directory's contents and package manifest before relying on its name.

Applications may depend on packages. Packages must not depend on applications. Shared design concepts must not depend on any implementation.

## 3. Core principles

### Design language first

- Consult the relevant guideline before changing behavior a person can perceive.
- Do not reduce a design decision to the limitations of one implementation.
- When an implementation exposes a platform-specific API, preserve the documented intent.
- Do not redefine the design language through implementation code.

### Simplicity and clarity

- Prefer the simplest implementation that fully satisfies the requirement.
- Add abstraction, configuration, and dependencies only for a demonstrated problem.
- Prefer explicit behavior over clever or speculative generality.

### Modularity and cohesion

- Give each area, package, and module one clear responsibility.
- Keep related behavior together and unrelated concerns apart.
- Depend on intentional interfaces, not incidental implementation details.
- Share a concept when it improves consistency; do not force different platforms into identical structures.

### Correctness and quality

- Treat accessibility, consistency, and maintainability as requirements.
- Investigate causes instead of hiding symptoms.
- Verify assumptions against the actual code, configuration, tests, and documentation.
- Do not claim a change works without running the relevant check.

## 4. Boundaries

- Keep the design language independent of any implementation's architecture.
- Keep platform-specific dependencies, APIs, and build assumptions inside their area.
- Do not introduce cross-package dependencies that create coupling or cycles.
- Keep public contracts deliberate and implementation details private.
- Extend an existing module when the work belongs to it. Create a new module only for a real responsibility or boundary.
- Do not create empty packages, placeholders, or speculative scaffolding.
- Do not reorganize directories for aesthetic uniformity.
- Treat consistency as shared design intent and user-facing expectations, not identical code, APIs, or structure.
- When implementations intentionally differ, record the reason in the area's technical documentation or tests.

When a shared foundation changes, find its consumers and verify them.

## 5. Naming and terminology

- Use clear, descriptive, consistent names.
- Follow the conventions of the language, framework, and area.
- Use one term for one concept across code, APIs, documentation, and tests.
- Search for existing usages before introducing or renaming a term.
- Keep files focused. Avoid both oversized modules and trivial fragmentation.

## 6. Documentation

- Keep documentation accurate and consistent with the implementation.
- Maintain one authoritative explanation and link to it instead of copying it.
- Update documentation when behavior, contracts, architecture, or conventions change.
- Remove obsolete instructions once they are confirmed outdated.
- Do not document unimplemented or unverified behavior, and do not invent guarantees.

## 7. Change management

- Understand the requested outcome and inspect the affected code, documentation, tests, and consumers before editing.
- Make the smallest coherent set of changes that fully solves the problem.
- Prefer incremental, independently verifiable changes.
- Preserve the working tree. Never discard or revert unrelated work.
- Do not edit generated output when its source is authoritative.
- Do not commit, push, publish, or release unless explicitly requested.

### Public contracts

Before changing a public contract, shared foundation, or widely consumed utility:

- Identify its consumers.
- Determine whether the change is compatible.
- Update affected implementations, tests, examples, and documentation.
- Verify the integration points.
- Report required breaking changes.

## 8. Commit conventions

Use Conventional Commits: `type(scope): description`.

- Types: `feat`, `fix`, `refactor`, `perf`, `style`, `test`, `docs`, `build`, `ci`, `chore`, `revert`.
- Scope is optional, lowercase, and uses established area terminology, such as `button`, `tokens`, `site`, or `docs`.
- Description: imperative, lowercase, no trailing period, ideally under 60 characters.
- Keep the message to a single line. Do not add bodies, blank lines, or co-author trailers.
- Choose the type from the actual purpose of the change, not from the files touched.
- One commit, one coherent change. Split unrelated work.
- Describe only what the staged diff supports. Never claim a fix or a passing test without evidence.

The subject must not restate the type or list modified files.

## 9. Dependencies and security

- Inspect existing dependencies before adding one. Prefer maintained packages that fit the actual requirement.
- Use the repository's package manager and workspace conventions. Never edit lockfiles manually.
- Keep runtime and development dependencies correctly classified.
- Never commit secrets, credentials, keys, or environment-specific values.
- Validate untrusted input. Avoid injection, unsafe deserialization, and insecure defaults.
- Evaluate dependency warnings instead of applying automated upgrades blindly.

## 10. Repository hygiene

- Remove confirmed-unused code, files, dependencies, and configuration when safe.
- Keep generated output, caches, dependency directories, and temporary artifacts out of source control.
- Keep ignore rules aligned with the real structure.
- Preserve required licenses, notices, and package metadata.
- Remove stale references after renames and moves.
- Verify that apparently unused files are not required by build tooling, entry points, dynamic imports, tests, or documentation.

## 11. Verification

Run the repository gates that cover the change:

| Command                              | Purpose                             |
| ------------------------------------ | ----------------------------------- |
| `pnpm format:check`                  | Formatting                          |
| `pnpm format`                        | Apply formatting                    |
| `pnpm lint`                          | Lint                                |
| `pnpm typecheck`                     | Type checking across workspaces     |
| `pnpm build`                         | Build all packages and applications |
| `pnpm --filter @dotm4x/one test:all` | Component and story tests           |

- Use the smallest command that validates the change, and broaden only when the result requires it.
- Run the area-specific commands described in the area's `AGENTS.md`.
- After each logical change, fix regressions before continuing.
- Documentation-only changes do not need test runs. Still verify formatting and that referenced paths and commands exist.
- Never report a check as passed unless it ran successfully. If a check cannot run, say why.

## 12. Decision priorities

1. Correctness and preservation of intended behavior.
2. Compliance with the documented design language.
3. Accessibility and platform-appropriate behavior.
4. Architectural coherence and modularity.
5. Simplicity and maintainability.
6. Consistency with established conventions.
7. Compatibility and developer experience.
8. Performance where it matters.
9. Extensibility justified by actual requirements.

Consider them together. Prefer established decisions unless evidence shows a concrete defect, contradiction, or meaningful improvement.

## 13. Working autonomously

1. Understand the objective and read the applicable instructions.
2. Read the relevant guidelines and inspect existing patterns, consumers, and tests.
3. Implement focused, coherent steps.
4. Format, lint, type-check, test, and build as appropriate.
5. Fix regressions and investigate unexpected failures.
6. Review the final diff for unintended changes.
7. Update documentation and examples.
8. Report changes, verification, and remaining concerns.

Do not ask for confirmation on ordinary decisions that repository context resolves safely. Ask when a requirement materially affects architecture, public contracts, design intent, or safety.

Do not expand a task without justification.

## 14. Completion criteria

A task is complete when:

- The requested outcome is implemented.
- Applicable instructions and design guidelines are followed.
- Boundaries and public contracts remain coherent.
- Relevant tests and checks ran, and regressions are resolved.
- Related documentation and examples are synchronized.
- The diff contains no known accidental or unrelated changes.

### Final report

- **Changes:** what was implemented.
- **Architecture:** meaningful decisions or boundary changes.
- **Verification:** the formatting, lint, test, type-check, and build results actually obtained.
- **Issues:** pre-existing failures, unresolved defects, skipped checks, and limitations.
- **Compatibility:** public API changes or migration requirements.

Do not claim exhaustive correctness or repository cleanliness without evidence.
