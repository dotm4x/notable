# Accessibility

Accessibility is the baseline for every Notable design, not an optional enhancement. Every interface must be usable with a keyboard, with a pointer, with touch, and with assistive technology. Accessibility is also part of expression: an element that cannot be used is not expressive at all.

## Usability across inputs

Every enabled interactive element must be reachable and operable by keyboard. Pointer, touch, and keyboard paths should make the same outcomes available. No information or action should depend on hover alone, because hover is not available to every user.

Disabled semantics depend on the control. A natively disabled control is unavailable to ordinary keyboard and pointer interaction. An accessibility state that communicates unavailability does not itself prevent activation or remove the control from focus order; behavior and focus must be handled according to the control's interaction model. See [States](../patterns/states.md).

## Names

Every interactive element needs a name that a person can understand. The name should include the text the user can see. A visible label such as "Max" should appear in the accessible name, so that a spoken name matches what is on screen. Icon-only controls need a name that describes their action.

## Landmarks and regions

A region should be labeled as a landmark only when it is a real page area that users navigate to, such as the main content or primary navigation. Decorative or repeated containers should not become landmarks, because too many landmarks make navigation harder. If several regions share a purpose, give each a distinct name that describes its role.

## Meaning without color

Status, selection, and disabled states must be understood without color alone. Pair color with text, an icon, weight, or a shape change.

## Contrast

Text and meaningful graphics meet WCAG AA contrast in both themes. See [Colors](./colors.md).

## Motion

Motion must respect a user's preference for reduced motion. See [Motion](./motion.md).

## Focus

Focus must always be visible and distinct. See [Focus](./focus.md).

## Gestures

A gesture, such as dragging, must always have a keyboard or assistive equivalent that reaches the same result. A user who cannot make the gesture must still be able to complete the task. See [Drag](../patterns/drag.md).

## Automated checks

Automated accessibility checks are a floor, not the goal. They catch many problems, but they do not confirm that a design is understandable. Designs should also be checked with a keyboard and, where possible, with a screen reader.

## Principle

Everything Notable offers should be available to everyone. A design is not finished until its interactions, names, contrast, and motion all work for people who cannot use it the default way.
