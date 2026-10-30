# AGENTS.md

# Notable

Notable is a design language for creating expressive, coherent, accessible, and thoughtfully crafted digital experiences.

It is not a single component library, framework, or platform-specific implementation. It defines a shared design philosophy, visual language, interaction principles, foundations, patterns, and guidelines that can be realized through multiple implementations.

The repository contains the design language's documentation, implementations, development tools, and supporting infrastructure. Each implementation translates Notable's principles into the conventions and capabilities of its target platform while preserving the coherence of the overall system.

The goal is to make Notable recognizable, adaptable, maintainable, and technically sound across its implementations.

---

## 1. Core Principles

### Design language first

- Treat Notable as a cohesive design language, not merely a collection of components.
- Use `docs/guidelines/` as the authoritative source for design principles, foundations, patterns, and component guidance.
- Consult the relevant guidelines before designing, implementing, or changing behavior that affects the user experience.
- Preserve the distinction between the design language and its individual implementations.
- Do not define a design decision solely around the limitations, conventions, or capabilities of one implementation.
- When an implementation exposes a platform-specific API, preserve the underlying intent and behavior of the corresponding design guidance whenever technically appropriate.
- Identify genuine gaps in the guidelines rather than silently inventing conflicting design decisions.

### Simplicity and clarity

- Prefer the simplest implementation that fully satisfies the requirements.
- Optimize for clarity, correctness, consistency, and long-term maintainability rather than minimum line count.
- Avoid unnecessary abstractions, indirection, configuration, dependencies, and layers.
- Prefer explicit, understandable behavior over clever or overly generalized solutions.
- Introduce complexity only when it solves a demonstrated problem.
- Avoid speculative extensibility, premature optimization, and infrastructure for hypothetical future requirements.
- Do not confuse simplicity with removing necessary safeguards, meaningful tests, or useful documentation.

### Modularity and cohesion

- Give every module, package, and implementation a clear responsibility.
- Keep related functionality together and unrelated concerns separate.
- Define clear boundaries between shared design decisions, platform-specific implementations, development tooling, and applications.
- Prefer cohesive modules with explicit contracts over tightly coupled collections of files.
- Minimize unnecessary dependencies between modules.
- Depend on stable, intentional interfaces rather than incidental implementation details.
- Keep internal implementation details private unless consumers genuinely need them.
- Avoid duplicating functionality across modules when a shared abstraction is justified.
- Do not centralize unrelated functionality merely to create a shared module.
- Preserve the ability to evolve, test, maintain, and replace individual implementations independently where appropriate.

### Correctness and quality

- Treat correctness, accessibility, consistency, and maintainability as requirements, not optional refinements.
- Investigate the cause of a problem rather than hiding its symptoms.
- Preserve established behavior and compatibility unless a change is explicitly justified.
- Verify assumptions against the repository's actual code, configuration, documentation, and tests.
- Do not claim that a change works without performing the relevant verification.
- Prefer evidence from executable checks and observable behavior over assumptions based on code appearance alone.

---

## 2. Design Language and Guidelines

The Notable design language is the shared source of truth for product-facing design decisions.

### Guideline hierarchy

The guidelines are organized into distinct areas:

- `docs/guidelines/principles/` defines the foundational principles of Notable.
- `docs/guidelines/foundations/` defines shared design foundations such as colors, typography, spacing, shape, elevation, focus, motion, and accessibility.
- `docs/guidelines/patterns/` defines reusable interaction and behavioral patterns.
- `docs/guidelines/components/` defines component-level design and behavioral expectations.

Use the most relevant documents for the task. Read their indexes and follow references to related guidelines when necessary.

### Rules for applying guidelines

- Treat the documented principles as the foundation for interpreting and applying the rest of the guidelines.
- Follow relevant foundation guidance when implementing components or patterns.
- Apply shared patterns consistently rather than inventing isolated interaction conventions.
- Use component guidelines to determine the intended role, behavior, states, and composition of individual components.
- When multiple guidelines apply, seek an interpretation that satisfies them together.
- Do not assume that a guideline for one component automatically applies to every other component.
- Do not introduce new visual conventions without checking existing guidelines and implementations first.
- Avoid creating duplicate or contradictory guidance in implementation-specific documentation.
- Keep implementation documentation focused on technical details that cannot be expressed meaningfully at the design-language level.

### When guidelines are incomplete or inconsistent

- Investigate the relevant documents, related patterns, existing implementations, and established decisions before changing anything.
- Distinguish a genuine contradiction from a legitimate platform-specific difference.
- Prefer preserving the documented design intent over copying incidental behavior from an existing implementation.
- If a design decision affects multiple implementations, update the shared guideline when appropriate rather than resolving it only in one implementation.
- If the task requires a new design decision, make the smallest coherent change that resolves the issue.
- Update affected documentation and examples alongside the implementation.
- Report unresolved ambiguities when a reliable decision cannot be established.

Do not silently redefine Notable's design language through implementation code.

---

## 3. Architecture and Repository Structure

### Architectural boundaries

- Preserve the repository's modular structure and the separation between design documentation, implementations, applications, and tooling.
- Keep shared design concepts independent of any one implementation's internal architecture.
- Treat each implementation as a realization of Notable rather than as the owner of the entire design language.
- Keep platform-specific APIs, dependencies, build systems, and runtime assumptions within their appropriate boundaries.
- Share concepts and behavior where doing so improves consistency, but do not force fundamentally different platforms into identical implementation structures.
- Avoid cross-package dependencies that introduce unnecessary coupling or circular dependency risks.
- Keep public contracts deliberate and implementation details encapsulated.
- Ensure that changes to shared foundations are evaluated across all affected consumers.

### Responsibility of repository areas

Use the existing repository organization and package manifests to establish the exact responsibilities of each area.

Broadly:

- `docs/guidelines/` defines the design language.
- `packages/` contains reusable implementations and their supporting code.
- `apps/` contains applications used to exercise, demonstrate, or develop the system.
- Root-level configuration defines shared repository tooling and workspace behavior.

These responsibilities are conceptual boundaries, not permission to impose the same internal architecture on every directory.

### Repository evolution

- Inspect the existing structure before introducing new packages, directories, abstractions, or architectural layers.
- Prefer extending an existing module when the new functionality clearly belongs to it.
- Create a separate module when it establishes a meaningful responsibility, boundary, or independently useful implementation.
- Do not create empty packages, placeholder implementations, unnecessary wrapper modules, or speculative platform scaffolding.
- Avoid moving files or reorganizing directories solely to achieve aesthetic uniformity.
- Keep naming, package manifests, dependency declarations, entry points, and documentation consistent with the actual structure.
- Do not assume that a directory name, package name, or README fully describes a module's real responsibility. Inspect its contents when relevant.

### Public and internal APIs

- Keep public APIs intentional, minimal, and predictable.
- Preserve existing contracts unless a change is necessary and its consequences are understood.
- Avoid exporting internal helpers, temporary abstractions, or implementation details without a concrete need.
- Prefer explicit contracts over implicit coupling.
- Consider compatibility, discoverability, composability, and future maintenance when designing public interfaces.
- Do not introduce breaking changes merely to make internal code look cleaner.
- When a breaking change is explicitly required, update all affected consumers, tests, documentation, and examples.

---

## 4. Technology and Implementation Independence

The root instructions are technology-agnostic.

They define repository-wide engineering principles without prescribing a particular language, framework, styling system, testing library, package manager, or build tool for every implementation.

### General rules

- Follow the conventions and capabilities of the technology used by the module being changed.
- Prefer idiomatic, well-supported platform capabilities over unnecessary custom infrastructure.
- Use the language's type system, validation mechanisms, and safety features appropriately.
- Avoid unsafe operations, unvalidated external input, implicit contracts, and unnecessary mutable state where relevant to the technology.
- Preserve explicit error handling and meaningful failure behavior.
- Avoid adding dependencies when existing platform capabilities or established dependencies adequately solve the problem.
- Evaluate dependencies for necessity, maintenance, compatibility, security, and impact on consumers.
- Keep runtime dependencies separate from development and build dependencies where the ecosystem supports that distinction.
- Do not impose a particular object-oriented, functional, declarative, or procedural style universally.
- Select the implementation style that best fits the module's responsibilities and existing conventions.

### Implementation-specific instructions

- Follow any applicable instructions in the target directory.
- Use implementation-specific guidance for language conventions, component architecture, styling, tests, builds, and tooling.
- Keep platform-specific rules in the narrowest appropriate instruction file.
- Avoid duplicating root-level principles in child instructions unless additional context is necessary.
- Treat more specific instructions as refinements of the root principles, not as permission to disregard repository-wide requirements.
- If instructions conflict, investigate the intended scope and resolve the conflict explicitly instead of arbitrarily choosing one.

Do not introduce framework-specific assumptions into shared design documentation or root architectural rules.

---

## 5. Naming and Code Organization

- Use clear, descriptive, consistent names.
- Prefer names that communicate responsibility and intent rather than incidental implementation details.
- Avoid ambiguous abbreviations, redundant words, and unnecessary naming complexity.
- Follow the conventions of the language, framework, and module.
- Use consistent terminology across code, public APIs, documentation, configuration, and tests.
- Preserve established naming conventions unless they are demonstrably inconsistent or harmful.
- Keep files and modules focused on coherent responsibilities.
- Avoid both excessively large modules and fragmentation into trivial files or abstractions.
- Keep implementation, tests, documentation, and related assets organized according to the module's established conventions.
- Do not force identical file layouts on technologies with different organizational needs.

When introducing or changing a term, search for related usages to prevent inconsistent terminology or stale references.

---

## 6. Code Quality and Maintainability

### Implementation quality

- Remove unnecessary complexity, duplication, dead code, unreachable paths, and obsolete compatibility logic when their removal is safe.
- Prefer straightforward control flow and explicit behavior.
- Avoid deeply nested conditionals, excessive indirection, and duplicated state.
- Reuse existing utilities and abstractions when they are appropriate to the task.
- Do not create generic helpers for trivial operations that occur only once without a compelling reason.
- Do not merge unrelated behavior into a shared utility merely because it looks similar.
- Avoid premature optimization and measure performance when optimization is important.
- Handle meaningful boundary conditions and failure cases.
- Preserve intentional extension points and useful public APIs.
- Keep configuration minimal and remove obsolete options only after checking their consumers.

### Irregularity detection

While working, remain alert to inconsistencies and defects beyond the immediate requested change.

Look for:

- Duplicate or conflicting implementations.
- Inconsistent naming and terminology.
- Unused files, imports, exports, variables, dependencies, and configuration.
- Stale references to renamed or removed modules.
- Mismatches between implementation, documentation, tests, and examples.
- Incorrect package exports or dependency declarations.
- Circular dependencies and unnecessary coupling.
- Duplicated design values or conflicting shared conventions.
- Inconsistent handling of errors, state, lifecycle, or resource cleanup.
- Missing handling of important boundary conditions.
- Fragile assumptions, unsafe operations, and unnecessary type escapes.
- Redundant abstractions, wrappers, state, and effects.
- Accidental public API changes.
- Tests that do not meaningfully verify the behavior they claim to cover.
- Suppressed errors, ignored checks, and obsolete workarounds.
- Build artifacts, temporary files, debug output, and unintended repository changes.

Do not turn every observation into an immediate refactor. Prioritize issues by correctness, impact, risk, and relevance.

Fix directly related, low-risk issues when they fit the task. For broader or potentially breaking problems, investigate and report them or address them in a separate, focused change.

---

## 7. Consistency Across Implementations

Notable may have multiple implementations with different technical constraints.

Consistency means preserving shared design intent and user-facing expectations where appropriate. It does not mean forcing every platform to use identical code, APIs, dependencies, or internal architecture.

- Follow the same documented design principles across implementations.
- Reuse the same conceptual foundations and patterns when applicable.
- Keep terminology and design decisions aligned.
- Preserve meaningful behavioral expectations across platforms.
- Respect native platform conventions and capabilities when they improve usability or accessibility without contradicting Notable's design intent.
- Do not copy implementation details between platforms without evaluating whether they are appropriate.
- Do not introduce a platform-specific workaround into shared guidelines unless it expresses a genuinely shared requirement.
- When one implementation reveals a gap in the design language, evaluate whether the shared documentation should change.
- When implementations intentionally differ, keep the reason clear in the relevant technical documentation or tests.

Avoid both uncontrolled divergence and artificial uniformity.

---

## 8. Accessibility, Interaction, and User Experience

Accessibility and usability are cross-cutting requirements for every user-facing implementation.

- Follow the applicable accessibility guidelines in `docs/guidelines/foundations/accessibility.md`.
- Consult the focus, motion, and relevant interaction-pattern guidelines when making user-facing changes.
- Prefer native platform semantics and behavior when appropriate.
- Ensure interactive experiences can be operated through the relevant supported input methods.
- Preserve meaningful focus, selection, disabled, loading, error, and other applicable states.
- Communicate important information through more than color or animation alone.
- Respect user preferences and operating-system accessibility settings.
- Avoid unnecessary motion, disruptive transitions, and interactions that obscure important information.
- Consider keyboard use, assistive technologies, different input methods, and relevant environmental constraints.
- Do not introduce accessibility regressions in pursuit of visual consistency or implementation simplicity.
- Verify accessibility-related behavior with appropriate automated checks and, where necessary, manual testing.

Use the platform's appropriate accessibility mechanisms rather than blindly applying the same technical solution everywhere.

---

## 9. Documentation and Traceability

Documentation is part of the system, not an afterthought.

- Keep documentation accurate, useful, concise, and consistent with the implementation.
- Update affected documentation whenever behavior, public contracts, architecture, or established conventions change.
- Prefer one authoritative explanation over several conflicting copies.
- Link to existing guidance rather than duplicating it unnecessarily.
- Keep README files, examples, configuration, exported APIs, and documented behavior aligned.
- Remove obsolete instructions and references when they are confirmed to be outdated.
- Preserve useful context, rationale, and technical constraints.
- Do not document behavior that has not been implemented or verified.
- Do not invent guarantees, compatibility claims, or supported capabilities.
- Keep design-language guidance separate from implementation-specific technical documentation.

When changing shared design foundations or architecture, identify the affected modules and update their documentation where necessary.

---

## 10. Tests and Verification

Verification is a required part of implementation work.

A change is not complete merely because the code has been written or appears correct.

### After each logical change

After completing each coherent unit of work:

1. Run the relevant tests.
2. Format the changed files using the repository's configured formatter.
3. Run the applicable lint checks.
4. Run the relevant type checks, static analysis, or equivalent validation.
5. Run affected builds or other checks when applicable.
6. Inspect the results and fix regressions introduced by the change before proceeding.

Choose the appropriate verification steps for the type and scope of the change. Do not run unrelated, expensive checks after every trivial edit when a smaller set of checks provides adequate feedback.

For changes involving shared foundations, cross-package contracts, public APIs, configuration, or build infrastructure, broaden verification to cover the affected consumers.

### Before finishing a task

- Run the complete relevant test suite.
- Run the repository's configured formatting verification.
- Run linting and static analysis.
- Run type checking where applicable.
- Build the affected packages and applications.
- Run integration, end-to-end, accessibility, or other specialized checks when relevant and available.
- Validate package exports, generated declarations, workspace relationships, and distribution entry points when affected.
- Search for stale imports, broken references, removed symbols, and outdated documentation.
- Inspect the final diff for unintended changes, missing files, generated artifacts, and accidental public API modifications.
- Confirm that the required checks have actually completed successfully.

Use the repository's existing scripts and configuration. Inspect package manifests and workspace definitions to determine the correct commands instead of guessing.

### Test quality

- Write or update tests for meaningful behavior changes and bug fixes.
- Test observable contracts, relevant edge cases, and regression scenarios.
- Prefer deterministic tests that verify real behavior.
- Avoid unnecessary mocks, arbitrary delays, brittle implementation details, and redundant coverage.
- Keep tests aligned with the actual intended behavior and documented contract.
- Never delete, skip, weaken, or rewrite meaningful assertions solely to make a check pass.
- Never change correct production behavior just to satisfy an incorrect test expectation.
- When a test reveals a genuine defect, fix the underlying problem.

### Handling failures

- Distinguish failures introduced by the change from pre-existing failures and environmental problems.
- Investigate unexpected failures rather than assuming they are unrelated.
- Do not suppress warnings, disable checks, or modify configuration merely to conceal a regression.
- If a check cannot run, state why.
- If a check fails and cannot be resolved safely, report the exact failure and its implications.
- Never claim that formatting, linting, tests, builds, or type checks passed unless they were actually executed successfully.

A passing test suite is evidence of correctness, not proof that every possible issue has been eliminated.

---

## 11. Change Management

### Scope and planning

- Understand the requested outcome before modifying files.
- Inspect relevant source files, documentation, dependencies, configuration, tests, and consumers.
- Identify architectural boundaries and potential regressions before making significant changes.
- Make the smallest coherent set of changes that fully solves the problem.
- Prefer incremental changes that can be independently inspected and verified.
- Avoid unrelated refactoring, opportunistic redesigns, and speculative features.
- When a task is broad, divide it into meaningful stages and verify each stage.
- Do not stop at an audit report when the task explicitly requires implementation.

### Preserving existing work

- Respect existing user changes and the current working tree.
- Do not discard, overwrite, or revert unrelated work.
- Avoid destructive commands and broad automated transformations without understanding their effects.
- Do not edit generated output directly when the source or build process is authoritative.
- Do not modify dependency directories or caches.
- Do not commit, push, publish, or release changes unless explicitly requested.

### Public contracts and compatibility

Before changing a public contract, shared foundation, package boundary, or widely consumed utility:

- Identify its consumers.
- Determine whether the change is backward-compatible.
- Update affected implementations, tests, examples, and documentation.
- Verify the relevant integration points.
- Clearly report any necessary breaking changes.

Do not assume that a change is safe simply because the local module still compiles.

---

## 12. Commit Conventions

Notable follows the Conventional Commits specification. Commit messages must be concise, precise, and supported by the actual changes.

### Format

`type(scope): description`

The scope is optional.

Use lowercase types and scopes. Keep descriptions concise, use imperative mood, and omit trailing punctuation. Aim for fewer than 60 characters for the complete subject when practical.

### Types

- `feat`: introduce genuinely new functionality or capabilities.
- `fix`: correct bugs, unintended behavior, or visual defects.
- `refactor`: restructure implementation without intentionally changing observable behavior.
- `perf`: improve performance.
- `style`: make formatting-only changes without affecting behavior or intended appearance.
- `test`: change tests without changing production behavior.
- `docs`: change documentation without changing implementation.
- `build`: change dependencies, package configuration, or build behavior.
- `ci`: change CI workflows or automation.
- `chore`: maintenance that does not fit a more specific type.
- `revert`: revert a previous commit.

Choose the type according to the actual purpose of the change. Never use `feat` as a generic label for production-code changes or `refactor` for changes that intentionally fix or alter behavior.

### Scope and Description

- Prefer a short, meaningful scope identifying the affected component or subsystem.
- Use established repository terminology.
- Describe the specific change, not the activity performed.
- Prefer concrete verbs such as `add`, `fix`, `remove`, `prevent`, `preserve`, `align`, `simplify`, `extract`, and `document`.
- Avoid vague descriptions such as `enhance functionality`, `update code`, `improve consistency`, and `various fixes` when a more precise description is possible.
- Do not repeat information already conveyed by the type or scope.
- Do not list modified files or implementation steps in the subject.

Prefer:

- `feat(button): add loading state`
- `fix(button): correct secondary hover colors`
- `fix(dialog): restore focus on close`
- `refactor(tokens): remove duplicate color values`
- `docs: clarify component composition guidelines`

### Commit Granularity

Every commit should represent one coherent, independently understandable change.

- Keep commits focused and small enough to review meaningfully.
- A commit may include implementation, styles, tests, and documentation when they belong to the same logical change.
- Split independent features, unrelated fixes, separate refactors, and unrelated formatting changes when practical.
- Do not combine unrelated changes merely because they were implemented in the same session.
- Do not split a coherent change into artificial commits simply to reduce its size.
- If staged changes contain unrelated work, prefer separating them before committing rather than hiding them behind a generic message.
- Never discard or rewrite the user's existing staged changes without permission.

### Accuracy

- Base the message on the actual staged diff, not assumptions from filenames, branch names, task descriptions, or recent conversation.
- Describe only changes supported by the diff.
- Never claim a bug was fixed, a feature was added, or tests passed without evidence.
- If a commit combines several changes that cannot reasonably be separated, describe their genuine shared purpose without misrepresenting the contents.
- Use the breaking-change marker `!` when compatibility is intentionally broken, such as `feat(button)!: replace variant API`.

### Message Body

Prefer a single-line message. Add a body only when important reasoning, constraints, or consequences cannot be expressed clearly in the subject.

Do not repeat the subject, summarize every modified file, or add generic introductory text.

Do not leave blank lines in commit messages. Never include "Co-authored-by" trailers or co-author attribution signatures.

### Final Output

When generating a commit message, output only the proposed message. Do not include explanations, quotation marks, emojis, Markdown formatting, or multiple alternatives unless explicitly requested.

Prioritize accuracy, clarity, and coherent changes over verbosity or conventional-looking labels.

## 13. Dependency and Security Hygiene

- Inspect existing dependencies before adding new ones.
- Prefer maintained dependencies that fit the module's actual requirements.
- Avoid unnecessary runtime dependencies and dependency duplication.
- Respect the repository's existing package manager, workspace configuration, and lockfile conventions.
- Use the package manager to update dependency metadata and lockfiles.
- Do not edit lockfiles manually unless the repository's tooling explicitly requires it.
- Avoid unnecessary installation scripts, privileged operations, and destructive tooling.
- Never introduce secrets, credentials, private keys, or sensitive environment values into source control.
- Validate untrusted input and use appropriate security mechanisms for the target platform.
- Avoid unsafe deserialization, injection vulnerabilities, accidental information exposure, and insecure defaults.
- Address relevant dependency and security warnings without blindly applying automated upgrades.
- Evaluate the compatibility and impact of dependency changes before accepting them.

Security requirements apply to shared infrastructure and individual implementations alike.

---

## 14. Repository Hygiene

Keep the repository intentional and easy to navigate.

- Remove confirmed-unused code, files, dependencies, and configuration when doing so is safe and relevant.
- Keep generated output out of source control unless it is intentionally part of the project's distribution or workflow.
- Do not commit local caches, temporary artifacts, dependency directories, or environment-specific files.
- Preserve required licenses, notices, configuration, and package metadata.
- Keep ignore rules aligned with the actual repository structure.
- Remove obsolete references after renames and moves.
- Avoid creating duplicate source files, redundant documentation, and temporary scaffolding that remains after the task.
- Keep scripts and automation understandable and consistent with repository conventions.
- Do not reorganize the repository wholesale simply to make it look cleaner.

When performing cleanup, verify that apparently unused files and exports are not required by build tooling, package entry points, dynamic imports, documentation, tests, or consumers.

---

## 15. Decision-Making

When multiple solutions are possible, evaluate them in this order:

1. Correctness and preservation of intended behavior.
2. Compliance with Notable's documented design language.
3. Accessibility, usability, and platform-appropriate behavior.
4. Architectural coherence and modularity.
5. Simplicity and maintainability.
6. Consistency with established conventions.
7. Compatibility and developer experience.
8. Performance and resource efficiency where relevant.
9. Extensibility justified by actual requirements.

These priorities should be considered together rather than applied mechanically.

Prefer established decisions when they remain sound. Challenge them when evidence reveals a concrete defect, contradiction, unnecessary complexity, or meaningful improvement.

Do not introduce a new convention simply because it is personally preferred.

When a decision has significant architectural consequences, explain the rationale and update the relevant documentation when appropriate.

---

## 16. Working Autonomously

When assigned a task:

1. Understand the objective and inspect the relevant repository context.
2. Read applicable instructions and design guidelines.
3. Identify existing patterns, affected modules, consumers, and verification requirements.
4. Investigate related irregularities that could affect the task.
5. Implement the change in focused, coherent steps.
6. Format, lint, test, type-check, build, and run other relevant checks as appropriate after each logical change.
7. Fix regressions and investigate unexpected failures.
8. Review the final diff and search for inconsistencies introduced or exposed by the change.
9. Update documentation and examples when necessary.
10. Report the work completed, verification performed, and remaining concerns.

Do not ask for confirmation for every ordinary implementation decision when the repository provides sufficient context to make a safe choice.

Ask for clarification when an unresolved requirement materially affects the architecture, public contract, design intent, or safety of the change.

When a reasonable decision can be made safely, proceed and explain important assumptions in the final report.

Be proactive about correctness and maintenance, but do not expand the task without justification.

---

## 17. Completion Criteria

A task is complete when:

- The requested outcome has been implemented.
- The change follows applicable instructions and Notable's documented design language.
- Architectural boundaries and public contracts remain coherent.
- Relevant tests and checks have been executed.
- Regressions introduced by the change have been resolved.
- Related documentation and examples are synchronized.
- The final diff contains no known accidental or unrelated modifications.
- Remaining failures, limitations, assumptions, and unresolved issues are explicitly reported.

### Final report

Provide a concise, factual summary containing:

- **Changes:** What was implemented or modified.
- **Architecture:** Any meaningful design decisions or boundary changes.
- **Verification:** The actual formatting, lint, test, type-check, build, and specialized check results.
- **Issues:** Relevant pre-existing failures, unresolved defects, skipped checks, or limitations.
- **Compatibility:** Any public API changes or migration requirements.

Do not claim exhaustive correctness or complete repository cleanliness without evidence.

**The objective is to evolve Notable as a coherent, technology-independent design language supported by modular, reliable, accessible, and maintainable implementations.**
