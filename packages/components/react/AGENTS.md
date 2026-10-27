# AGENTS.md — Notable React

This package is the React implementation of Notable, a technology-independent design language for expressive, coherent, accessible, and thoughtfully crafted digital experiences.

Notable's design language is defined in `documentation/guidelines/`. This package translates those guidelines into reusable React components, styles, interaction behavior, and public APIs.

Follow the root `AGENTS.md` and all applicable instructions. These instructions establish the implementation-specific conventions for this package.

The objectives are to preserve Notable's design intent, deliver an excellent developer experience, maintain strict correctness and accessibility, and keep the implementation cohesive, modular, and easy to maintain.

---

## 1. Source of Truth

Before implementing or modifying a component:

1. Read the relevant design guidelines under `documentation/guidelines/`.
2. Inspect the existing component implementation, related components, shared helpers, tokens, tests, and stories.
3. Check the public exports and package configuration.
4. Identify existing patterns that should be reused before creating new ones.

### Design guidelines

- Follow the relevant principles, foundations, patterns, and component guidelines.
- Treat the documented design language as the authority for visual decisions and interaction behavior.
- Do not introduce isolated visual conventions or undocumented behavior without justification.
- Preserve Notable's expressive character, visual coherence, and restraint.
- Use existing shared foundations and patterns instead of implementing competing versions.
- If a guideline is ambiguous or contradictory, investigate related documentation and implementations before deciding.
- Update shared guidelines when a change establishes a design decision that applies beyond React.
- Keep React-specific implementation details in this package's technical documentation rather than duplicating them in the design guidelines.

### Existing code

- Inspect established implementations before introducing a new component pattern, helper, hook, or styling convention.
- Reuse existing code when its responsibility and behavior genuinely match the requirement.
- Do not copy an existing implementation blindly if it contains a defect or violates the documented design language.
- Avoid maintaining multiple implementations of the same behavior without a demonstrated reason.

---

## 2. Component Architecture

### General principles

- Build focused, composable, predictable React components.
- Keep public APIs explicit and minimal.
- Prefer composition over complicated prop combinations.
- Separate public component behavior from internal implementation details.
- Use native HTML semantics and browser behavior whenever appropriate.
- Keep application-specific business logic outside reusable library components.
- Avoid unnecessary state, effects, refs, callbacks, memoization, wrappers, and abstractions.
- Prefer derived values over duplicated state.
- Preserve native attributes and event handlers when doing so provides a useful, consistent public API.
- Follow the Rules of Hooks.
- Avoid direct DOM manipulation unless a concrete technical requirement justifies it.

### Component complexity and Base UI

Use `@base-ui/react` for complex interactive components when its primitives provide meaningful behavior, accessibility, state management, or interaction infrastructure.

Examples of components that may justify Base UI include:

- Dialogs and modal interfaces.
- Drawers and other dialog-based surfaces.
- Popovers and tooltips.
- Selects and comboboxes.
- Menus and similar composite interactions.
- Tabs, accordions, and other stateful interactive patterns.
- Other components that require sophisticated focus management, keyboard interaction, dismissal, or coordinated state.

This list is illustrative, not an instruction to use Base UI for every component in these categories. Evaluate the actual implementation and the capabilities of the installed version.

For simple components, prefer native HTML, React, CSS, and existing shared helpers.

Examples include:

- Badges and separators.
- Simple cards and presentational wrappers.
- Skeletons and straightforward loading indicators.
- Simple avatars and decorative elements.
- Basic buttons when native button behavior satisfies the requirements.

Do not add Base UI merely to implement a simple element that does not need its interaction infrastructure.

Conversely, do not recreate complex interaction behavior manually when Base UI already provides an appropriate primitive.

### Mandatory Base UI encapsulation

**Never expose Base UI as Notable's public component API.**

Base UI is an internal implementation dependency, not the public identity of Notable.

- Wrap Base UI primitives in Notable-owned components.
- Define Notable's own public props, types, exports, composition model, and styling.
- Adapt Base UI's API to Notable's documented design and interaction requirements.
- Expose only the behavior and customization that consumers genuinely need.
- Keep Base UI imports, primitive details, internal state adapters, and implementation-specific types private.
- Do not require consumers to import Base UI primitives to complete ordinary Notable workflows.
- Do not expose Base UI-specific prop names or types solely for convenience.
- Do not blindly forward every primitive prop or internal attribute.
- Forward native attributes and extensibility points when they are appropriate to Notable's public contract.
- Keep the underlying primitive replaceable without unnecessarily breaking consumers.
- Use the installed Base UI version's actual API and documentation. Do not assume APIs from another version.

Wrapping a primitive does not mean hiding useful behavior. Preserve necessary capabilities through an intentional Notable API.

### Composition and compound components

When a component has meaningful public subcomponents, expose them through a namespace-style compound API using dot notation.

Preferred:

```tsx
<Avatar.Root>
  <Avatar.Image src="/avatar.png" alt="User avatar" />
  <Avatar.Fallback>JD</Avatar.Fallback>
</Avatar.Root>
```

Avoid separate top-level public component names for parts of the same compound component when namespace composition is appropriate:

```tsx
<AvatarFallback />
<AvatarImage />
```

Rules:

- Use a single public namespace for a coherent compound component.
- Prefer `Component.Root`, `Component.Trigger`, `Component.Content`, `Component.Item`, `Component.Image`, and `Component.Fallback` where those roles are appropriate.
- Do not add a `Root` subcomponent when a simple component has no meaningful compound structure.
- Do not create empty or unnecessary subcomponents merely to enforce uniformity.
- Keep the API intuitive and consistent across related components.
- Ensure subcomponents have clear responsibilities and support the documented composition model.
- Preserve accessibility relationships and correct behavior when subcomponents are composed.
- Keep internal helper components private unless they are intentionally part of the public API.

Implement namespace exports using an approach compatible with React, TypeScript, tree-shaking, and the existing build configuration.

---

## 3. Repository Structure

Implement React components inside `source/components/`.

Use the following structure for a typical component:

```text
source/components/
└── avatar/
    ├── avatar.tsx
    ├── avatar.css
    ├── avatar.test.tsx
    └── avatar.stories.tsx
```

The files have distinct responsibilities:

- `avatar.tsx`: implementation, public props, public subcomponents, and component-related types.
- `avatar.css`: component-specific styles.
- `avatar.test.tsx`: behavioral and contract tests.
- `avatar.stories.tsx`: public examples and interactive documentation.

Rules:

- Use a dedicated lowercase directory for each component.
- Keep component implementation, stylesheet, tests, and stories together.
- Follow the same naming convention for other components.
- Do not create meaningless files merely to satisfy the example structure.
- Keep shared utilities and cross-component infrastructure outside individual component directories.
- Follow the existing locations for shared styles, helpers, and configuration.
- Keep exports synchronized with the actual public API.
- Do not create duplicate implementations, unnecessary nested directories, or speculative scaffolding.
- Never edit `dist/`, `storybook-static/`, generated declarations, or other generated outputs directly.
- Do not modify `node_modules/` or generated dependency files.

### Shared code

Use `source/helpers/` for reusable, implementation-level helper functions and hooks that have a clear shared purpose.

Use `source/internal/` for established internal infrastructure when that directory already owns the relevant responsibility.

Use the existing directory conventions instead of creating competing locations.

- Inspect shared helpers before implementing similar behavior.
- Extract code only when it provides meaningful reuse or a clear architectural boundary.
- Avoid generic utility collections containing unrelated functions.
- Keep component-specific behavior local when sharing it would make the architecture more complicated.
- Do not export internal helpers from the package entry point unless they are deliberately part of the supported public API.

---

## 4. Naming Conventions

Consistency in naming is mandatory across files, components, styles, tests, stories, types, and public exports.

### Files and identifiers

- Component directories: lowercase kebab-case, such as `radio-group/` and `number-flow/`.
- Component files: match the component's established name, such as `radio-group.tsx`.
- React components and public namespaces: PascalCase.
- Variables, functions, hooks, and parameters: camelCase.
- CSS classes: follow the Notable class naming convention defined below.
- Test and Storybook files: `<component>.test.tsx` and `<component>.stories.tsx`.

Use clear English names and established terminology. Avoid unexplained abbreviations and inconsistent synonyms.

### Type names

Prefix named TypeScript types with `T`.

Examples:

```tsx
type TAvatarProps = {
  src?: string;
  alt: string;
};

type TAvatarFallbackProps = {
  children: React.ReactNode;
};

type TDialogState = 'open' | 'closed';
type TSelectionResult = {
  value: string;
  selected: boolean;
};
```

Rules:

- Use descriptive names such as `TAvatarProps`, `TDialogState`, and `TSelectionResult`.
- Do not use bare generic parameter names such as `T` when a descriptive name is appropriate. Prefer `TValue`, `TElement`, or `TResult`.
- Keep implementation-only types private.
- Export types only when consumers need them to use or understand the public API.
- Avoid exporting redundant aliases or internal Base UI types.
- Use `interface` or `type` according to the existing implementation conventions and the needs of the declaration.
- Do not introduce a new naming convention for individual components.

The `T` prefix applies to named types, not variables, functions, React component values, or namespaces.

### React components

- Use PascalCase for exported components and compound namespaces.
- Use descriptive names that communicate purpose rather than the underlying primitive.
- Keep names consistent across related component APIs.
- Do not expose implementation names from Base UI merely because they match the underlying primitive.

---

## 5. TypeScript and React

- Use modern TypeScript compatible with the configured compiler and React version.
- Preserve strict type checking and nullability.
- Never use `any`.
- Prefer accurate types, discriminated unions, explicit public contracts, and meaningful type narrowing.
- Use `unknown` for values that require validation before use.
- Avoid unjustified casts, non-null assertions, and redundant runtime checks.
- Prefer immutable data transformations and `readonly` where it expresses the intended contract.
- Use `satisfies` when it improves type validation while preserving inferred types.
- Let TypeScript infer straightforward local values.
- Keep public component props minimal, explicit, and predictable.
- Avoid excessive generic APIs and boolean combinations that permit invalid states.
- Preserve relevant native HTML attributes, events, refs, and accessibility behavior.
- Use controlled or uncontrolled state according to the component's intended contract.
- Avoid effects for values that can be derived during rendering.
- Use `useMemo` and `useCallback` when they solve a concrete performance, identity, or correctness problem, not by default.
- Avoid custom hooks that only wrap one trivial operation without adding meaningful reuse or abstraction.
- Use the existing `motion` dependency when its capabilities are appropriate; do not add a competing animation library without a compelling reason.

### Ref handling

- Follow the React version and existing ref conventions.
- Support refs when they are useful to consumers or required by the component contract.
- Ensure refs reach the intended DOM element or primitive where appropriate.
- Do not add refs to every component without a clear reason.
- Preserve ref behavior when wrapping Base UI primitives.

### Error handling

- Handle meaningful failure and boundary conditions explicitly.
- Avoid swallowing errors or using fallback behavior that conceals invalid states.
- Validate data at genuine trust boundaries.
- Do not add redundant runtime validation for values already guaranteed by a sound internal contract unless the boundary warrants it.

---

## 6. Design Tokens and Shared Styles

**The shared design tokens are the source of truth for styling.**

Always inspect and reuse the existing tokens under `source/styles/tokens/` and the shared styles under `source/styles/` before introducing new values or styling conventions.

### Required locations

- `source/styles/index.css`: shared style entry point.
- `source/styles/fonts.css`: shared font definitions.
- `source/styles/tokens/`: shared design tokens, organized by category.
- `source/styles/motion.ts`: shared motion helpers or definitions where appropriate.
- `source/styles.d.ts`: existing style type declarations.
- `source/internal/styles/`: shared styles that are not design tokens and are reused by several components, such as `floating-surface.css`. Components apply them through a shared class and import the stylesheet.

Preserve the actual responsibilities of these files and follow the existing import structure.

### Token rules

- Reuse existing tokens for colors, spacing, typography, radii, borders, shadows, blur, layering, opacity, and motion when available.
- Prefer semantic tokens over raw palette values.
- Do not introduce arbitrary hardcoded design values when an appropriate token already exists.
- Do not duplicate existing tokens under new names.
- Keep tokens agnostic of components and of specific visual values. Do not add a token for one component's infrastructure (for example, a scrollbar color). Add a token only when it is generic and reusable, and never rename or reshape an existing token to fit one feature.
- Reuse existing generic tokens inside shared styles instead of creating new ones.
- Add tokens only when they represent meaningful, reusable design decisions.
- Place new tokens in the appropriate existing category.
- Keep naming semantic, consistent, and independent of individual components.
- Avoid component-specific values in shared tokens unless they express a genuinely reusable design decision.
- When changing a shared token, inspect its consumers and verify the impact across the library.
- Update affected documentation and examples when a token change modifies an established design decision.

If a token is genuinely missing, add it to the appropriate token file rather than silently hardcoding the value in component styles.

### Token organization

Keep token categories clearly separated. Preserve existing file boundaries and expand them only when necessary.

Use category comments sparingly in token files to distinguish meaningful groups of related declarations.

For example:

```css
/* Semantic surfaces */
--notable-surface: ...;
--notable-surface-raised: ...;

/* Semantic text */
--notable-text: ...;
--notable-text-muted: ...;

/* Interactive states */
--notable-focus-ring: ...;
```

This example illustrates organizational intent, not new token names that must be introduced.

Rules:

- Use short, meaningful category headings.
- Keep each declaration in the correct category.
- Avoid redundant comments that repeat the token name or its value.
- Do not use token files as an excuse to introduce duplicate or unnecessary abstractions.
- Preserve existing naming conventions and token relationships.

### CSS versus inline styles

- Use CSS classes and component stylesheets for styling.
- Do not use Tailwind CSS or introduce utility-class frameworks.
- Do not replace the established styling architecture with inline style objects.
- Use inline styles only when values are genuinely dynamic at runtime and cannot reasonably be expressed through the existing class and custom-property system.
- Prefer CSS custom properties for meaningful dynamic values when appropriate.
- Do not use inline styles to bypass existing design tokens.
- Avoid global selectors that leak component styles into unrelated parts of the application.
- Avoid excessive specificity, `!important`, and conflicting declarations.
- Use logical CSS properties when appropriate.
- Preserve responsive behavior and supported writing directions.
- Respect reduced-motion preferences.

---

## 7. CSS Class Naming

Use a consistent, component-scoped BEM-inspired naming convention.

The root prefix is `notable-`.

### Component block

A component's root class is:

```css
.notable-avatar {
}
.notable-dialog {
}
.notable-radio-group {
}
```

Format:

`notable-{component}`

Use lowercase kebab-case for component names.

### Elements

Elements belonging to a component use a double underscore:

```css
.notable-avatar__image {
}
.notable-avatar__fallback {
}

.notable-dialog__title {
}
.notable-dialog__description {
}
.notable-dialog__close {
}
```

Format:

`notable-{component}__{element}`

An element is a meaningful part of its component, not an arbitrary wrapper.

Avoid unnecessary nesting in class names. Prefer `.notable-dialog__title` over `.notable-dialog__content__title`.

### Modifiers

Use a double hyphen for explicit component variants:

```css
.notable-button--primary {
}
.notable-button--secondary {
}
.notable-button--small {
}
.notable-button--large {
}
```

Format:

`notable-{component}--{modifier}`

Use modifiers for intentional, documented variations, not every implementation detail.

### State and accessibility selectors

Prefer semantic attributes for runtime states where appropriate:

```css
.notable-switch[data-checked] {
}
.notable-dialog[data-open] {
}
.notable-select__item[aria-selected='true'] {
}
.notable-button:focus-visible {
}
.notable-button:disabled {
}
```

Use the actual attributes and state conventions supported by the component and its underlying primitive.

Do not invent data attributes or assume Base UI state attributes exist without verifying the installed version and actual rendered markup.

Rules:

- Use classes for structural identity and intentional variants.
- Prefer semantic attributes and pseudo-classes for states already expressed through them.
- Do not encode the same state redundantly in multiple classes and attributes without a concrete reason.
- Do not use generic class names such as `.root`, `.active`, `.content`, or `.label` without component scoping.
- Do not create global styles for component-specific behavior.
- Do not target fragile internal Base UI DOM structure when a stable class, supported slot, or public state attribute is available.
- Keep CSS class names consistent between implementation, tests where needed, and documentation examples.

---

## 8. Icons

**Use `lucide-react` for all interface icons.**

- Import icons from the existing `lucide-react` dependency.
- Do not introduce additional icon libraries.
- Do not substitute emoji, Unicode symbols, arbitrary text characters, or handcrafted icon glyphs for interface icons.
- Use consistent icon sizing, alignment, stroke treatment, and spacing.
- Use existing design tokens for dimensions and spacing where applicable.
- Keep icons decorative when they add no information of their own.
- Ensure icon-only interactive controls have an accessible name through an appropriate label or accessible text.
- Do not use an icon as the sole accessible name when it has no meaningful text alternative.
- Prefer existing Lucide icons over custom SVGs when a suitable icon exists.
- Keep icon selection appropriate to the meaning and context of the control.

An icon should communicate the intended action or meaning clearly. Do not add icons merely for decoration when they reduce clarity or consistency.

---

## 9. Base UI Integration

Base UI is an internal tool for complex interaction behavior, not a public dependency of Notable's component API.

### Integration rules

- Use the installed `@base-ui/react` package and verify its actual API before implementation.
- Wrap primitives in Notable-owned components and namespaces.
- Keep Base UI types and implementation details internal.
- Map Base UI states and props to an intentional Notable API.
- Preserve useful native attributes and consumer capabilities when they fit the public contract.
- Do not forward arbitrary props indiscriminately.
- Avoid duplicating state that Base UI already manages.
- Do not build a second focus-management, dismissal, keyboard-navigation, or selection system when Base UI already provides the necessary behavior.
- Add custom behavior only when Notable's documented requirements are not already satisfied.
- Avoid CSS selectors that depend on undocumented implementation details.
- Test the integration between Notable's wrapper and Base UI, not Base UI's entire internal implementation.

### Styling Base UI

- Apply Notable classes through supported styling mechanisms.
- Use Notable design tokens for all shared design decisions.
- Preserve the expected visual and interaction states.
- Verify focus, disabled, selected, open, closed, and other relevant states.
- Do not override primitive behavior merely to reproduce a visual effect.
- Keep the public component functional when used through the documented composition model.

### Testing Base UI wrappers

Do not write redundant tests for behavior that Base UI already guarantees and that Notable does not change.

For example, if a wrapper uses a Base UI dialog without modifying its keyboard and dismissal behavior, do not recreate an exhaustive test suite for Base UI itself.

Instead, test:

- Notable's public API and composition.
- The correct integration of the primitive.
- Notable-specific state and styling contracts.
- Any customized behavior or altered defaults.
- Accessibility relationships that Notable introduces or controls.
- Regressions caused by the wrapper or its styling.
- Any behavior whose correctness depends on Notable's own implementation.

Add tests for underlying primitive behavior when the wrapper changes that behavior, depends on a specific integration detail, or exposes a contract that could regress independently.

---

## 10. Accessibility

Accessibility is a fundamental requirement, not an optional enhancement.

Every user-facing component must follow the relevant guidelines in `documentation/guidelines/foundations/accessibility.md`, `focus.md`, and any applicable interaction-pattern documentation.

### Semantics and naming

- Prefer native semantic HTML.
- Use the correct interactive element for the intended action.
- Provide accessible names, descriptions, and labels where required.
- Use ARIA only when necessary to communicate semantics or relationships not already provided by native HTML.
- Do not add redundant, invalid, or contradictory ARIA attributes.
- Ensure icon-only controls have accessible names.
- Ensure decorative icons are appropriately hidden from assistive technologies.
- Associate labels, descriptions, errors, and instructions with the correct controls.
- Preserve semantic relationships across compound components.

### Keyboard and focus

- Ensure interactive components support appropriate keyboard interaction.
- Preserve logical focus order.
- Provide visible focus indicators using the established focus tokens and guidelines.
- Respect focus management provided by Base UI.
- Ensure overlays and composite widgets behave correctly when opened, closed, and navigated.
- Avoid keyboard traps except where a properly implemented modal interaction requires focus containment.
- Verify restoration of focus when an interaction requires it.

### States and feedback

- Communicate disabled, invalid, selected, expanded, loading, and other relevant states correctly.
- Do not rely exclusively on color, animation, or visual styling to communicate important information.
- Maintain sufficient contrast.
- Respect reduced-motion preferences.
- Ensure animations do not obstruct interaction or understanding.
- Preserve usable behavior across supported input methods.

### Accessibility verification

Use a combination of:

- Semantic and accessible-role assertions in component tests.
- Keyboard interaction tests.
- Automated accessibility checks where available.
- Playwright tests for browser-dependent behavior.
- Manual verification when automated checks cannot establish correctness.

Automated accessibility checks are necessary where appropriate, but they do not replace keyboard and interaction testing.

Never remove accessibility behavior merely to simplify an implementation or satisfy a visual requirement.

---

## 11. Comments and Documentation

**Do not add ordinary code comments.**

Write clear code and use documentation for explanations.

Avoid comments that:

- Restate what the next line does.
- Repeat a function, variable, prop, or type name.
- Describe obvious implementation steps.
- Mark routine sections of code.
- Preserve outdated explanations.
- Explain code that should instead be made clearer through naming or structure.

Do not add comments such as:

```tsx
// Handle the click event.
function handleClick() {
  // Update the state.
  setOpen(true);
}
```

Prefer descriptive names and straightforward code.

### Exceptions

Comments are appropriate when they explain something that cannot be understood reliably from the code alone, such as:

- A non-obvious browser or platform workaround.
- A critical invariant that must be preserved.
- A subtle interoperability constraint.
- A surprising limitation of an external primitive.
- A security-sensitive or correctness-sensitive decision whose rationale is essential.

Such comments must be concise, specific, and maintained alongside the implementation.

### Token files

Short category comments are permitted in shared token files under `source/styles/tokens/` to group declarations meaningfully.

Do not extend this exception to ordinary component CSS or implementation files.

### Public documentation

Document the public API and behavior that consumers need to understand.

Appropriate documentation includes:

- Public component props and types.
- Compound component composition.
- Supported variants and states.
- Non-obvious behavior and usage constraints.
- Accessibility requirements or relevant consumer responsibilities.
- Public customization points and documented examples.

Do not create public documentation for private helpers, internal hooks, Base UI adapters, internal state machinery, or other implementation details.

Internal code should remain understandable through its structure and naming. Do not add documentation solely to describe trivial internal functions.

Keep README files, Storybook autodocs, examples, and public types aligned with the actual API.

---

## 12. Component Tests

Use the existing Vitest and React Testing Library infrastructure.

Follow the naming convention:

`source/components/{component}/{component}.test.tsx`

### Arrange–Act–Assert

Use the Arrange–Act–Assert (AAA) pattern.

- Arrange: create the component, props, initial state, and required dependencies.
- Act: perform the operation or user interaction.
- Assert: verify the observable result and relevant side effects.

Do not add comments to mark AAA phases. Use clear test structure and descriptive names instead.

Example:

```tsx
it('opens the dialog when the trigger is activated', async () => {
  const user = userEvent.setup();

  render(<ExampleDialog />);

  await user.click(screen.getByRole('button', { name: 'Open dialog' }));

  expect(screen.getByRole('dialog')).toBeVisible();
});
```

This is illustrative. Adapt the test to the component's actual public API and accessibility contract.

### Test behavior, not implementation

- Test public behavior and observable contracts.
- Prefer accessible queries such as `getByRole`, `getByLabelText`, and `getByText`.
- Use `userEvent` for realistic user interactions where appropriate.
- Use asynchronous queries and `waitFor` when behavior is genuinely asynchronous.
- Verify callbacks, state changes, composition, accessible names, and important boundary conditions.
- Test meaningful variants and states without repeating the same assertion unnecessarily.
- Keep tests deterministic, isolated, and understandable.
- Restore mocks and clean up resources when necessary.
- Avoid arbitrary sleeps, unnecessary snapshots, excessive mocking, and tests that depend on execution order.
- Do not rely on private implementation details unless a narrowly scoped integration test genuinely requires them.

### Avoid redundant Base UI tests

When a component wraps Base UI, do not duplicate Base UI's own test coverage.

Test the behavior that Notable owns:

- Its public API.
- Its composition and wrapper integration.
- Its defaults and customized behavior.
- Its styling and state mapping.
- Its accessibility contract.
- Its documented interactions.
- Any integration behavior that could regress through changes in Notable's code.

Do not write large test suites for primitive functionality that Notable neither implements nor changes.

### Regression tests

When fixing a bug, add a focused regression test when practical.

The test should fail for the original defect and pass for the corrected behavior.

Never delete, skip, weaken, or rewrite meaningful assertions merely to achieve a passing test suite.

---

## 13. Playwright and Browser Testing

Use the repository's existing Playwright setup for browser-level verification when the task requires real browser behavior.

Do not introduce another browser automation framework when Playwright is already the established solution.

### When to use Playwright

Use component tests for fast, isolated behavior.

Use Playwright for behavior that needs an actual browser or application environment, including:

- Complete user workflows across multiple components.
- Browser-specific focus behavior and keyboard interactions.
- Dialogs, popovers, drawers, tooltips, and other overlay interactions when browser behavior matters.
- Navigation, routing, and URL behavior in the sandbox.
- Responsive layouts and viewport-dependent behavior.
- Scroll, pointer, drag, and other real-browser interactions.
- Integration issues involving CSS, layout, stacking contexts, portals, or browser events.
- Critical accessibility workflows that cannot be verified adequately through unit tests alone.

Do not turn every component test into an end-to-end test.

### Test structure

- Follow the existing Playwright configuration, test directory, fixtures, and naming conventions.
- Reuse shared fixtures and helpers when they provide genuine value.
- Keep tests independent and deterministic.
- Give each test a clear user-visible objective.
- Use descriptive test names.
- Keep setup and cleanup predictable.
- Do not duplicate a large amount of setup across tests when an established fixture already provides it.

### Locators and interactions

Prefer resilient, user-facing locators:

1. Accessible roles and names.
2. Labels and associated form controls.
3. Explicit test IDs when semantic locators are insufficient.
4. Other stable selectors only when necessary.

Rules:

- Prefer `getByRole`, `getByLabel`, `getByPlaceholder`, and other suitable Playwright locators.
- Use `getByTestId` when an appropriate user-facing locator is unavailable or when a stable technical target is genuinely necessary.
- Do not add test IDs to every element.
- Avoid selectors coupled to incidental DOM nesting or fragile CSS class names.
- Use accessible names that reflect the intended public experience.
- Prefer user interactions such as `click`, `fill`, `check`, and keyboard input over direct DOM manipulation.
- Do not bypass a broken interaction by modifying internal state or evaluating arbitrary page scripts unless the test specifically targets that low-level behavior.

### Synchronization and reliability

- Use Playwright's built-in auto-waiting and web-first assertions.
- Wait for observable conditions rather than arbitrary elapsed time.
- Avoid `waitForTimeout` except for a documented case where time itself is the subject of the test.
- Do not rely on network-idle events as a universal readiness signal.
- Wait for the relevant element, URL, response, or state.
- Avoid brittle assumptions about animation duration or execution order.
- Use deterministic data and controlled fixtures where practical.
- Ensure tests do not depend on a particular execution order.
- Avoid shared mutable state across parallel tests.
- Use isolated browser contexts when required.
- Clean up resources and test-created data.

### Browser configuration

- Use the existing Playwright configuration and scripts.
- Inspect the sandbox and its startup configuration before deciding how to launch the application.
- Reuse configured web servers and fixtures rather than creating redundant server processes.
- Do not hardcode environment-specific URLs when the configuration provides a base URL.
- Do not silently change timeouts, retries, browser coverage, or parallelism to hide flaky tests.
- Keep browser-specific exceptions documented when they are genuinely necessary.
- Avoid unnecessary browser installation or configuration changes.

### Accessibility in Playwright

Verify important workflows through realistic keyboard and pointer interaction.

For applicable components, test:

- Accessible names and roles.
- Opening and closing interactions.
- Keyboard navigation and activation.
- Focus movement and restoration.
- Escape-key behavior where applicable.
- Dismissal and interaction boundaries.
- State changes and resulting accessible behavior.
- Responsive usability when relevant.

Do not assume that a passing automated accessibility scan proves the entire interaction is accessible.

### Base UI and Playwright

Do not repeat every unit-level assertion in Playwright.

Prefer browser tests that verify meaningful integration behavior, such as:

- A composed Notable dialog opening and closing in the sandbox.
- Keyboard interaction and focus restoration.
- A popover or select functioning in a real browser.
- Correct positioning, layering, scrolling, or responsive behavior.
- A regression that cannot be reproduced reliably in the component test environment.

Keep browser coverage focused on realistic workflows and actual browser-dependent risks.

---

## 14. Storybook

Storybook is the interactive documentation and development environment for the public React implementation.

Follow the installed Storybook version, framework, configuration, and existing conventions.

### File conventions

Keep stories next to their component:

`source/components/{component}/{component}.stories.tsx`

Use CSF conventions supported by the installed version.

### Standard story pattern

Every component with meaningful public behavior should have a consistent, useful Storybook entry.

Use a common structure:

1. Default: the simplest representative usage.
2. Variants: documented visual and behavioral variants.
3. Sizes: supported size options when applicable.
4. States: meaningful disabled, loading, selected, invalid, expanded, or other relevant states.
5. Composition: a representative example for compound components.
6. Interaction: a realistic example when the component has meaningful interactive behavior.

Do not create a separate story for every trivial prop combination.

Choose stories that demonstrate the public contract clearly and reveal meaningful differences.

### Metadata and controls

- Use descriptive story titles and consistent naming.
- Provide appropriate `args` and `argTypes` for meaningful public props.
- Use sensible defaults and controls that reflect the actual API.
- Exclude internal implementation details and private props from public controls.
- Use autodocs where supported and consistent with the installed configuration.
- Keep component metadata and story examples synchronized with the public API.
- Use real component implementations rather than duplicating component logic in stories.
- Reuse existing Notable components, design tokens, and Lucide icons.
- Avoid emoji and arbitrary placeholder glyphs when an appropriate icon is available.

### Compound components

- Demonstrate the intended namespace API.
- Show realistic composition and appropriate nesting.
- Include representative subcomponent behavior where it helps explain usage.
- Avoid stories that depend on undocumented internal primitives or implementation details.
- Ensure examples respect accessibility requirements.

### Interactive stories

- Use Storybook's supported interaction testing capabilities when they add meaningful value.
- Keep stories deterministic and independently understandable.
- Avoid unnecessary asynchronous complexity.
- Do not duplicate the entire component test suite in Storybook.
- Verify important public interactions when those interactions are part of the story's purpose.

### Visual consistency

- Use Notable's tokens and guidelines rather than story-specific styling that conceals implementation problems.
- Keep backgrounds and surrounding content appropriate for the component being demonstrated.
- Avoid inconsistent example layouts across similar components.
- Use the same public API consumers are expected to use.

Stories must reflect the actual behavior of the exported component, not a simplified mock of its intended appearance.

---

## 15. Motion and Animation

Motion is part of Notable's design language and must be implemented consistently.

- Follow `documentation/guidelines/foundations/motion.md` and relevant interaction-pattern guidelines.
- Reuse the shared motion tokens and helpers.
- Use CSS transitions and animations for straightforward visual effects.
- Use the existing `motion` dependency when its capabilities are appropriate.
- Do not introduce another animation library without a compelling technical reason.
- Avoid unnecessary animation state, timers, layout recalculations, and duplicated motion logic.
- Preserve responsiveness and interaction feedback.
- Avoid excessive, distracting, or purely decorative motion.
- Respect `prefers-reduced-motion`.
- Ensure motion does not interfere with keyboard navigation, focus, readability, or accessibility.
- Do not use animation as the only way to communicate important state changes.
- Test meaningful interaction and reduced-motion behavior when relevant.

Do not introduce new animation conventions without consulting the shared motion guidance and helpers.

---

## 16. Package Exports and Public API

The public API must remain intentional, coherent, and independent of internal implementation choices.

- Export supported components and their public types through the established package entry point.
- Export compound components using the intended namespace API.
- Keep internal helpers, private hooks, Base UI adapters, and internal types out of public exports.
- Do not expose Base UI primitives as substitutes for Notable components.
- Keep exports, declarations, styles, package metadata, and documentation synchronized.
- Preserve the package's supported import paths and module formats.
- Avoid redundant aliases, duplicate public entry points, and unnecessary compatibility layers.
- Verify that the build emits the expected exports and declarations.
- Inspect consumer-facing API changes before modifying existing exports.
- Do not introduce breaking changes without explicit justification and corresponding documentation.

The public API should describe Notable, not reveal how Notable happens to be implemented today.

---

## 17. Dependencies and Package Management

- Follow the repository's pnpm workspace and package management conventions.
- Inspect existing dependencies before introducing a new one.
- Prefer existing dependencies when they adequately satisfy the requirement.
- Use Base UI for justified complex interactions, not simple presentational elements.
- Use `lucide-react` for all interface icons.
- Use the existing Motion, testing, and Storybook infrastructure where appropriate.
- Keep runtime and development dependencies correctly classified.
- Preserve required React peer dependency constraints.
- Do not introduce competing frameworks, styling systems, icon libraries, or browser-testing tools without a compelling reason.
- Do not edit lockfiles manually.
- Use pnpm for dependency changes and verify the resulting workspace state.
- Remove unused dependencies only after checking actual usage, scripts, build configuration, and package exports.

---

## 18. Formatting, Linting, and Verification

Verification is part of every implementation task.

### After each logical change

After each coherent change or batch of related edits:

1. Format the changed files with the repository's configured formatter.
2. Run relevant component tests.
3. Run the applicable lint checks.
4. Run TypeScript checks.
5. Run any affected builds or specialized checks.
6. Investigate failures and fix regressions introduced by the change before continuing.

Do not wait until the entire task is finished to discover that a basic change broke the package.

Use the repository's existing commands rather than inventing new scripts.

### Required final verification

**Always run `pnpm test:all` before declaring the task complete.**

Inspect the root and package scripts to confirm the command's actual scope and behavior.

In addition, run the relevant configured formatting, lint, type-check, and build commands. Do not assume `pnpm test:all` automatically covers all of them unless the scripts prove it.

When the task affects browser behavior, run the relevant Playwright suite as well. If the complete `test:all` script already includes that suite, do not run the same suite redundantly without a reason.

### Formatting

- Use the configured formatter, including CSharpier or other tools only where applicable to the repository's actual technologies.
- Follow existing formatting conventions.
- Do not manually fight the formatter.
- Avoid unrelated formatting changes that create noisy diffs.
- Verify formatting after automated refactors or broad edits.

### Linting and type checking

- Run the repository's actual lint commands.
- Run the configured TypeScript checks for affected packages.
- Resolve newly introduced errors and warnings where applicable.
- Do not suppress diagnostics simply to obtain a successful exit code.
- Do not loosen compiler or lint rules to accommodate incorrect code.
- Preserve strict typing and accurate public declarations.

### Builds

- Build affected packages when implementation, exports, styles, package configuration, or dependencies change.
- Verify the package build and generated declarations when public API changes are involved.
- Validate Storybook when story configuration or stories change.
- Validate the sandbox when integration behavior or examples change.
- Inspect generated output only as a verification artifact; edit the authoritative source instead.

### Failure handling

- Distinguish new failures from existing failures and environment-related issues.
- Investigate failures rather than automatically attributing them to unrelated causes.
- Do not delete tests, disable checks, weaken assertions, or hide warnings to make verification pass.
- If a check cannot run, explain the reason.
- Report the exact checks performed and their actual results.
- Never claim success for a check that was not executed successfully.

---

## 19. Repository Consistency and Cleanup

While implementing a task, proactively identify relevant irregularities.

Look for:

- Duplicate component behavior or unnecessary helpers.
- Inconsistent public props, type names, and compound APIs.
- Inconsistent CSS class naming.
- Hardcoded values that duplicate existing tokens.
- Unused CSS declarations and obsolete tokens.
- Stale Base UI integrations or assumptions about primitive APIs.
- Missing or incorrect public exports.
- Mismatches between component behavior, tests, stories, and documentation.
- Unnecessary tests that duplicate primitive behavior.
- Missing regression coverage for customized behavior.
- Accessibility regressions or incomplete interaction states.
- Unused imports, variables, exports, and dependencies.
- Redundant wrappers, state, effects, or memoization.
- Fragile Playwright locators, arbitrary waits, and flaky tests.
- Inconsistent Storybook structure and controls.
- Debug output, temporary files, and obsolete references.

Fix relevant, low-risk issues when they are directly related to the task.

Do not expand a focused task into an uncontrolled repository-wide rewrite. Record broader issues and address them in a separate, coherent change when necessary.

When performing a cleanup, verify that code is genuinely unused before deleting it.

---

## 20. Working Procedure

For every assigned task:

1. Read the root instructions and applicable local instructions.
2. Read the relevant Notable design guidelines.
3. Inspect the affected component, shared helpers, tokens, styles, tests, stories, exports, and consumers.
4. Determine whether Base UI is justified or whether native React and HTML are sufficient.
5. Identify the intended public API and relevant accessibility requirements.
6. Implement the smallest coherent solution using established conventions.
7. Update component tests and stories where appropriate.
8. Format, lint, test, type-check, and build as required after each logical change.
9. Run `pnpm test:all` before completion.
10. Run relevant Playwright checks when browser-level behavior is affected.
11. Inspect the final diff for inconsistencies, unintended API changes, and unrelated modifications.
12. Report the changes, verification results, and remaining issues.

Do not stop at identifying problems when the task requires implementation.

Do not ask for confirmation for ordinary implementation choices that can be resolved safely from existing code and guidelines.

Ask for clarification when an unresolved requirement materially affects public behavior, compatibility, design intent, or architecture.

---

## 21. Completion Criteria

A task is complete only when:

- The implementation follows Notable's design language.
- The public API is coherent and does not leak Base UI implementation details.
- Existing tokens, shared helpers, CSS conventions, and naming patterns are respected.
- Accessibility and relevant interaction behavior are preserved.
- Meaningful tests and stories reflect the actual public contract.
- Redundant Base UI behavior is not needlessly retested.
- Relevant formatting, lint, type-check, build, and test checks have been executed.
- `pnpm test:all` has been executed and its actual result recorded.
- Relevant browser tests have been executed when required.
- Documentation and public exports are synchronized.
- The final diff contains no known accidental changes.
- Remaining failures and limitations are reported honestly.

### Final report

Provide a concise summary of:

- Changes implemented.
- Public API or architectural decisions.
- Relevant accessibility and behavior considerations.
- Tests, formatting, linting, type checks, builds, and Playwright checks executed.
- The actual result of `pnpm test:all`.
- Remaining issues or pre-existing failures.

Never claim that a task is fully verified when required checks were skipped or failed.

**The goal is a React implementation that feels unmistakably like Notable, while remaining accessible, modular, consistent, and independent of its underlying implementation primitives.**
