# Colors

Color in Notable communicates roles. It tells the user what a surface is for, what a piece of text means, and what status something carries. Decoration is secondary. The palette is restrained: mostly neutral surfaces, with a small set of accents and status colors used sparingly.

## Roles

Each color has a job. Designs should use the role, not a specific color value.

- **Surface** holds the page, containers, popups, and emphasis areas.
- **Text** appears in a primary and a secondary strength. Secondary text supports, and never replaces, primary information.
- **Accent** marks the main action and the active indicator.
- **Status** colors (danger, success, warning, and information) signal the outcome of an action or the condition of an item. They always appear with text or an icon.
- **Highlight** is a neutral surface that marks the option under the pointer or keyboard.

## Two themes, one meaning

Light and dark themes share the same roles. A role keeps the same job in both themes, even though its value changes. A designer should never choose a color for one theme that breaks the role in the other. If a role looks correct in light mode but disappears in dark mode, the role is failing, not the theme.

## Contrast

Text and meaningful graphics meet WCAG AA contrast in both themes. Status colors must pass for the text they color. When a color fails, the fix is to adjust the role's color, not to weaken the requirement or to rely on color alone. Color may reinforce a state, but it never carries one alone. See [Selection](../patterns/selection.md) and [States](../patterns/states.md).

## Surfaces and depth

Surfaces at different levels must remain distinguishable in both themes. Color supports this distinction but does not replace the depth and layering rules in [Elevation](./elevation.md).

## Principle

Color should tell the user what something is for. Every role must remain legible, distinct, and correct in both themes.
