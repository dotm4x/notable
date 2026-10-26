# Focus

Focus shows where the keyboard is. It tells a keyboard or assistive technology user which element will respond to their next action. Focus must always be visible when the keyboard is in use, and it must be distinct from every other state.

## Focus, highlight, and selection are different things

- **Focus** is where the keyboard is.
- **Highlight** is the option under the pointer or the active option in a list.
- **Selection** is the value the user has chosen.

These can coincide, but they should be visually distinct. A user should be able to tell whether the keyboard has moved, whether the pointer is hovering, and what they have already chosen.

## Visibility

Focus must be clearly visible against its surroundings. It should appear when the user navigates by keyboard. It should not appear as a side effect of a pointer click where it would only add noise, unless the element is a text field where focus is the editing state.

## Treatment

The focus treatment is a ring or outline placed outside the element, with a clear offset from its edge. The same treatment should appear across the interface, so a user learns it once. Focus must never be removed without a replacement.

## Containers

Focus must not be clipped by the container that holds the element. When a focused element sits at the edge of a scrolling or bordered container, its focus treatment should still be fully visible.

## Dragging

Focus does not follow pointer movement during a drag, and focus alone does not start a drag. Whether a pointer press or a committed drag moves focus depends on the control and remains an open question in [Drag](../patterns/drag.md).

## Principle

A keyboard user should always know where they are, and that knowledge should look the same everywhere.

## Open question

Whether a single focus treatment should apply to every control, or whether tight containers require an inset treatment. Today the answer varies by component, and no rule yet settles which variant is correct.
