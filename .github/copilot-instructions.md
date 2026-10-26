# Copilot Instructions

## Principles

- Follow the repository's established architecture, conventions, and patterns.
- Prefer correctness, clarity, consistency, accessibility, and simplicity over unnecessary abstraction.
- Make focused changes. Avoid unrelated refactoring, speculative features, and unnecessary dependencies.
- Inspect existing implementations, related components, design tokens, styles, tests, and stories before introducing new patterns.
- Prioritize a cohesive design system over isolated component decisions.
- Keep components composable, reusable, and predictable without sacrificing usability or expressiveness.
- Preserve Bodypop's visual identity, interaction patterns, and established design language.

## Visual Identity

- Build a friendly, expressive, playful interface design system with a cohesive visual identity.
- Use approachable shapes, soft curves, and carefully balanced proportions without making the interface feel childish.
- Avoid industrial, sharp, sterile, or overly corporate visual treatments.
- Treat motion, shape, typography, and interaction feedback as defining parts of the design language.
- Prefer warm, rounded, readable typefaces that complement the playful identity.
- Keep interfaces polished, usable, accessible, and visually coherent. Playfulness must not compromise clarity or usability.
- Use restrained visual treatments where appropriate, but do not confuse simplicity with a lack of personality.
- Establish shared design decisions through tokens and reusable patterns rather than isolated component styling.

## Naming

- Use clear, complete English names. Avoid unnecessary abbreviations and ambiguous identifiers.
- Use `PascalCase` for React components, types, interfaces, and other exported type-like declarations.
- Use `camelCase` for variables, functions, parameters, and local values.
- Use consistent terminology across related components, APIs, and packages.
- Prefer descriptive names that communicate purpose rather than implementation details.
- Never use `any`. Prefer explicit types, meaningful generics, `unknown` when appropriate, and proper type narrowing.
- Use descriptive generic type parameter names, such as `TValue`, `TElement`, and `TResult`. Avoid bare generic names such as `T` when a meaningful name is appropriate.
- Follow existing file naming and export conventions.

## TypeScript

- Use modern, idiomatic TypeScript compatible with the configured language version.
- Follow the repository's TypeScript configuration, ESLint rules, and formatting conventions.
- Preserve strict type checking and respect nullability.
- Prefer explicit, accurate types for public APIs and complex values. Let TypeScript infer straightforward local values.
- Use `type` and `interface` according to the repository's established conventions.
- Prefer discriminated unions and precise types over loosely typed objects, boolean combinations, or unnecessary type assertions.
- Avoid unjustified type assertions, non-null assertions, and redundant runtime checks.
- Use `readonly` where immutability is part of the intended contract.
- Prefer immutable data transformations and avoid unnecessary mutation.
- Use `satisfies` when validating an expression against a type without losing its inferred specificity.
- Keep public component props explicit, minimal, and consistent.
- Export only APIs intended for consumers. Keep implementation details private.
- Preserve existing public API behavior unless a change is explicitly required.

## React

- Use modern React patterns compatible with the installed React version.
- Build components as small, focused, composable units.
- Prefer function components and explicit props.
- Use semantic HTML elements whenever possible instead of recreating their behavior with generic elements.
- Keep rendering declarative. Avoid direct DOM manipulation unless a specific requirement justifies it.
- Follow the Rules of Hooks.
- Use controlled or uncontrolled state according to the component's intended behavior. Avoid unnecessary internal state.
- Use derived values instead of duplicating state that can be calculated from existing props or state.
- Avoid unnecessary effects, memoization, callbacks, and refs. Introduce them when they solve a concrete problem.
- Forward relevant native HTML attributes and event handlers when doing so makes the component API more useful and consistent.
- Preserve native browser behavior unless Bodypop explicitly needs to change it.
- Keep components independent of application-specific business logic.
- Avoid introducing dependencies when React or the browser already provides an appropriate solution.

## Component Architecture

- Keep each component responsible for a clear, well-defined purpose.
- Follow the existing package structure, component organization, and export conventions.
- Place every component in its own directory under `source/components/`.
- Keep each component's implementation, styles, tests, and Storybook stories together in that directory.
- Reuse shared utilities, hooks, primitives, and established component patterns when appropriate.
- Avoid duplicate implementations and parallel APIs that solve the same problem.
- Separate public component APIs from internal implementation details.
- Keep styling, behavior, accessibility, and type definitions consistent with the component's responsibilities.
- Prefer composition over complicated prop combinations or inheritance-like abstractions.
- Introduce shared abstractions only when they solve a demonstrated problem across multiple components.
- Do not create abstractions for hypothetical future requirements.
- Preserve consistency across variants, sizes, and interaction patterns.
- Avoid adding dependencies to the components package without a clear technical or functional justification.

## Project Structure

- Preserve the existing monorepo and package structure.
- Implement library components inside `packages/components/react/source/components/`.
- Create a dedicated directory for each component, using its lowercase component name.
- Use the component's name consistently for its implementation, stylesheet, tests, and stories.
- Keep shared styles, design tokens, font definitions, and global CSS in their existing locations.
- Keep package entry points, build configuration, TypeScript declarations, and exports consistent with the existing setup.

A typical component directory looks like this:

```text
packages/components/react/source/components/
└── badge/
    ├── badge.tsx
    ├── badge.css
    ├── badge.test.tsx
    └── badge.stories.tsx
```

- `badge.tsx` contains the component implementation and its public types.
- `badge.css` contains the component's styles.
- `badge.test.tsx` contains its Vitest tests.
- `badge.stories.tsx` contains its Storybook stories.
- Include tests and stories when appropriate for the component and task. Do not create empty or meaningless files merely to satisfy the structure.
- Follow the same pattern for all components, such as `button/` and `spinner/`.
- Do not place component-specific files directly inside `source/components/`.
- Do not introduce additional directory levels or reorganize existing components without a concrete reason.
- Do not move shared design tokens or global styles into individual component directories.
- Never edit generated `dist/` or `storybook-static/` files directly. Use the appropriate build commands to regenerate generated output when necessary.
- Do not modify `node_modules/` or generated dependency files.

## Styling

- Use the repository's established styling approach and CSS conventions.
- Keep component styles modular, predictable, and scoped to their intended components.
- Place component-specific styles in the component's own CSS file.
- Import the component stylesheet according to the existing import conventions.
- Follow existing CSS naming conventions and class composition patterns.
- Avoid unnecessary global styles, selectors that leak across components, and excessive specificity.
- Prefer CSS custom properties backed by Bodypop design tokens over hardcoded design values.
- Do not introduce arbitrary colors, spacing, typography, radii, shadows, borders, or motion values when an appropriate token already exists.
- Use component-specific CSS variables only when they provide a meaningful customization point or encapsulate a component-level decision.
- Keep structural styles, visual treatments, interactive states, and responsive behavior organized and understandable.
- Use modern CSS features when they improve clarity, maintainability, or behavior.
- Avoid duplicating styles across components. Extract shared styling only when the abstraction is justified.
- Do not use inline styles for values that belong in the stylesheet or design token system.
- Preserve focus indicators, disabled states, loading states, and other interaction-related styling.
- Support responsive layouts and different input methods where relevant.
- Use logical CSS properties when appropriate to support different writing directions.
- Respect reduced-motion preferences and other relevant accessibility settings.
- Do not add global CSS rules for a component when its behavior can be implemented through its own stylesheet.

## Global Styles and Design Tokens

- Treat the existing global styles and design tokens as the source of truth for shared visual decisions.
- Inspect `source/styles/` before introducing or changing shared styling.
- Preserve the existing organization of global styles, including `source/styles/index.css`, `source/styles/fonts.css`, and the token files.
- Keep shared tokens in their appropriate files under `source/styles/tokens/`.
- Use the existing token categories, including colors, radii, spacing, and typography.
- Reuse existing tokens for colors, typography, spacing, sizing, radii, borders, shadows, opacity, layering, and motion when available.
- Do not create duplicate tokens or alternative names for existing design decisions.
- Keep token naming consistent, semantic, and independent of individual component implementations.
- Prefer semantic tokens when they exist instead of referencing raw palette values directly.
- Add new tokens only when they represent a meaningful, reusable design decision.
- When a shared token changes, inspect its consumers and evaluate the impact across the component library.
- If a genuine token gap exists, add the token to the appropriate shared token file instead of hardcoding the value in a component stylesheet.
- Keep token definitions, CSS custom properties, TypeScript types, documentation, and examples synchronized when applicable.
- Do not introduce new global stylesheets or token categories without a clear architectural reason.
- Keep font definitions centralized in `source/styles/fonts.css` and typography tokens in `source/styles/tokens/typography.css`.
- Choose typefaces that support the library's friendly, expressive identity while maintaining readability.
- Apply the global font through shared styles instead of redundantly declaring it in every component.
- Evaluate typography changes across the component library before finalizing them.
- Do not modify global styles to solve a problem that belongs to an individual component.

## Motion and Animation

- Treat motion as an integral part of Bodypop's design language rather than decorative polish added inconsistently.
- Reuse existing motion tokens, durations, easing curves, and animation conventions.
- Prefer CSS transitions and animations for straightforward visual interactions.
- Use the existing `motion` dependency when its capabilities are appropriate and consistent with the component's requirements.
- Do not introduce another animation library when the existing tools are sufficient.
- Keep animations smooth, purposeful, and consistent across components.
- Animate appropriate properties without introducing unnecessary layout recalculations or rendering overhead.
- Provide clear visual feedback for relevant interaction states.
- Avoid excessive motion, distracting effects, and inconsistent animation timing.
- Respect `prefers-reduced-motion` and provide appropriate reduced-motion behavior.
- Ensure animations do not interfere with keyboard navigation, pointer interaction, readability, or accessibility.
- Keep motion implementation maintainable and avoid duplicating animation logic unnecessarily.

## Accessibility

- Treat accessibility as a core component requirement, not an optional enhancement.
- Prefer native HTML semantics and built-in browser behavior.
- Ensure interactive components are usable with a keyboard.
- Provide visible and consistent focus indicators.
- Use accessible names, labels, descriptions, and ARIA attributes when necessary.
- Do not add ARIA attributes that duplicate or contradict native semantics.
- Follow established accessibility patterns for interactive components.
- Ensure disabled, loading, selected, expanded, and invalid states are communicated appropriately.
- Do not rely exclusively on color, animation, or visual appearance to communicate meaning.
- Maintain sufficient contrast and respect user preferences for motion and interaction.
- Test keyboard behavior and accessibility-related edge cases when relevant.

## Icons

- Follow Bodypop's established icon conventions.
- Use the existing `lucide-react` dependency for icons when appropriate.
- Avoid Unicode symbols, emoji, or arbitrary text characters as substitutes for interface icons.
- Keep icon sizing, alignment, stroke treatment, and spacing consistent.
- Ensure icon-only interactive components have accessible names.
- Treat decorative icons as hidden from assistive technologies when appropriate.
- Avoid introducing additional icon dependencies when the existing library is sufficient.
- Follow existing icon usage patterns in components and Storybook stories.

## Component Tests

### Structure

- Use Vitest for unit and component tests.
- Use the existing React Testing Library and `@testing-library/user-event` dependencies when appropriate.
- Keep tests next to their corresponding component in its dedicated directory.
- Follow the naming convention `<component>.test.tsx`.
- Test public behavior rather than private implementation details.
- Keep test utilities and shared fixtures separate from production code.
- Introduce shared test infrastructure only when genuinely necessary.
- Follow the existing Vitest configuration and test setup.

### Testing Behavior

- Give each test one clearly defined behavioral purpose.
- Use descriptive test names that explain the expected behavior.
- Prefer tests that verify accessible roles, names, user-visible output, and interactions.
- Test rendering, variants, sizes, props, callbacks, and relevant component states.
- Cover disabled behavior, loading behavior, keyboard interaction, and edge cases where applicable.
- Use parameterized tests when multiple inputs verify the same behavior.
- Keep test data explicit and understandable.
- Avoid tests that depend on internal implementation details, CSS class names, or incidental DOM structure unless those details are part of the public contract.
- Avoid unnecessary snapshots. Prefer assertions that explain which behavior is expected.
- Mock external dependencies only when necessary.
- Keep tests deterministic, isolated, and independent.

### Arrange–Act–Assert

- Structure tests using the Arrange–Act–Assert (AAA) pattern when appropriate.
- **Arrange:** establish the component props, initial state, and required dependencies.
- **Act:** perform the user interaction or operation under test.
- **Assert:** verify the observable result and relevant side effects.
- Keep setup, execution, and assertions clearly separated.
- Use comments to identify these phases when they improve readability.
- Prefer realistic user interactions over directly invoking implementation details.

### Test Quality

- Verify observable behavior, public contracts, accessibility, boundary conditions, and relevant regressions.
- Assert meaningful rendered output, state changes, callbacks, and side effects.
- Prefer accessible queries such as `getByRole`, `getByLabelText`, and `getByText` when appropriate.
- Use asynchronous queries and utilities when behavior is genuinely asynchronous.
- Clean up resources and restore mocks when necessary.
- Avoid arbitrary delays, shared mutable state, unnecessary mocking, and tests that depend on execution order.
- Derive expected behavior from component contracts, documentation, and established design decisions.
- Never weaken, delete, or skip tests merely to conceal failures.
- Do not modify production code solely to make a test pass.

## Storybook

- Use Storybook to document and demonstrate the public API and behavior of components.
- Follow the installed Storybook version, framework, and configuration.
- Keep stories next to their corresponding component in its dedicated directory.
- Follow the naming convention `<component>.stories.tsx`.
- Keep stories consistent with the component's actual props and supported behavior.
- Provide meaningful examples of default behavior, variants, sizes, and relevant interactive states.
- Use appropriate `args` and `argTypes` to make supported component properties easy to explore.
- Include autodocs when supported and consistent with the existing configuration.
- Reuse existing icons and design tokens in stories.
- Do not use emoji, arbitrary Unicode characters, or placeholder symbols when a proper icon is available.
- Avoid duplicating component implementations inside stories.
- Ensure examples demonstrate realistic usage and accessible interaction patterns.
- Keep stories synchronized with changes to component APIs and behavior.
- Add stories for significant states or edge cases when they help consumers understand the component.

## Documentation

- Document public APIs, component props, variants, and non-obvious behavior where appropriate.
- Keep documentation concise, accurate, and consistent with the actual implementation.
- Explain meaningful constraints, accessibility considerations, and usage requirements.
- Use examples that follow Bodypop's established conventions.
- Avoid documenting guarantees the implementation does not provide.
- Keep README files, Storybook documentation, examples, and exported types synchronized with the implementation.
- Do not duplicate documentation unnecessarily across multiple locations.

## Package Management and Dependencies

- Follow the repository's package manager, workspace configuration, and dependency conventions.
- Inspect existing dependencies before introducing new ones.
- Avoid unnecessary runtime dependencies, especially in the public components package.
- Reuse existing dependencies such as React, Lucide, Motion, Vitest, and Storybook when appropriate.
- Distinguish runtime dependencies from development-only dependencies.
- Keep package manifests, exports, build configuration, and generated type declarations consistent.
- Preserve the package's intended module formats and supported import paths.
- Do not commit generated output or dependency directories unless explicitly required by the repository.
- Follow existing build and distribution conventions.

## Changes

- Inspect relevant files, component consumers, tests, stories, design tokens, styles, and package exports before changing behavior or public APIs.
- Make the smallest coherent change that fully addresses the task.
- Preserve compatibility unless breaking changes are explicitly requested.
- Keep implementation, types, styles, tokens, tests, stories, documentation, and package configuration consistent.
- Avoid unrelated refactoring and unnecessary file changes.
- Verify that new components follow the established design system rather than introducing isolated visual conventions.
- Report significant decisions, behavior changes, verification results, and remaining issues clearly.

## Verification

- Run the relevant Vitest tests after each logical batch of changes.
- Run the complete test suite after finishing a coherent set of changes.
- Run the repository's existing lint, type-check, and build commands when relevant.
- Verify Storybook stories and examples when component behavior or documentation changes.
- Check for regressions in shared tokens, styles, and related components when modifying shared design-system infrastructure.
- Never claim a test, build, lint, or type check passed unless it was executed successfully.
- Report failures, skipped tests, untested behavior, and unresolved ambiguities accurately.
