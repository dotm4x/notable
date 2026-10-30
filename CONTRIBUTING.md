# Contributing to Notable

Thank you for your interest in contributing to Notable! Notable is an expressive, coherent, accessible design language and component system for digital experiences.

This guide outlines our core principles, development workflow, and coding standards to help you contribute effectively.

---

## 1. Guiding Principles

- **Design language first:** The guidelines in [`docs/guidelines/`](./docs/guidelines/) are our source of truth. Always align new components and behavioral changes with documented design foundations and patterns before writing code.
- **Accessibility is required:** Usability and accessibility are non-negotiable. Follow [`docs/guidelines/foundations/accessibility.md`](./docs/guidelines/foundations/accessibility.md). Ensure full keyboard navigation, screen reader support, accessible focus states, and reduced-motion considerations.
- **Simplicity and clarity:** Prefer the simplest solution that completely solves the problem. Avoid speculative abstractions, premature optimizations, and unnecessary dependencies.
- **Modularity:** Keep responsibilities clear. Shared design concepts remain independent of any single platform implementation or framework.

---

## 2. Repository Structure

Notable is organized as a monorepo managed with `pnpm` workspaces:

- **[`docs/guidelines/`](./docs/guidelines/):** Design language documentation (principles, foundations, patterns, and component guidelines).
- **[`packages/components/`](./packages/components/):** The core React component library.
- **[`apps/site/`](./apps/site/):** Next.js documentation and marketing site.
- **[`apps/docs/`](./apps/docs/):** Astro documentation site.

---

## 3. Development Workflow

### Prerequisites

- **Node.js:** `>= 22.23.4`
- **pnpm:** `^12.9.1`

### Getting Started

```bash
# Clone the repository
git clone https://github.com/dotm4x/notable.git
cd notable

# Install dependencies across all workspaces
pnpm install

# Run component library build / development
pnpm --filter @notable/components build
pnpm --filter @notable/sandbox dev
```

---

## 4. Quality and Verification

Every contribution must be verified before opening a pull request. Make sure the following commands pass:

```bash
# Type check all workspaces
pnpm typecheck

# Lint with ESLint
pnpm lint

# Check formatting with Prettier
pnpm format:check

# Format files automatically
pnpm format

# Build all packages and applications
pnpm build
```

---

## 5. Commit Conventions

Notable follows the [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Format

```text
type(scope): description
```

- **Scope:** Optional, lowercase (e.g. `button`, `tokens`, `site`, `docs`).
- **Description:** Concise, imperative mood, lowercase, no trailing period (aim for fewer than 60 characters).
- **Single-line rule:** Keep commit messages strictly to a single line. Do not add blank lines, message bodies, or `Co-authored-by` trailers.

### Types

- `feat`: Genuinely new features or capabilities.
- `fix`: Bug fixes, visual defects, or unintended behavior.
- `refactor`: Code improvements that preserve existing observable behavior.
- `perf`: Performance improvements.
- `style`: Formatting-only changes without behavioral effect.
- `test`: Adding or modifying tests.
- `docs`: Documentation-only updates.
- `build`: Build system or dependency updates.
- `ci`: CI workflows and automation updates.
- `chore`: Routine maintenance and housekeeping tasks.

**Examples:**

- `feat(button): add loading state`
- `fix(dialog): restore focus on close`
- `refactor(site): reset to clean Next.js starter template`
- `docs(agents): disallow blank lines and co-author trailers`

---

## 6. Pull Request Process

1. **Keep PRs focused:** Each PR should address one coherent feature, fix, or improvement. Avoid mixing unrelated refactors into a single PR.
2. **Update docs and tests:** If your change modifies component APIs, behavior, or foundations, update the corresponding documentation and tests.
3. **Run local verification:** Ensure `pnpm lint`, `pnpm typecheck`, and `pnpm format:check` all pass cleanly.
4. **Self-review:** Inspect your git diff before opening the PR to verify that no accidental files, secrets, or temporary artifacts are included.
