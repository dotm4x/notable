# States

A state describes the condition an element is in at a given moment. Notable uses a consistent set of states so that users can understand what an element is doing and how it will respond.

## The states

- **Default** is the resting condition. It should be calm and not draw unnecessary attention.
- **Hover** previews pointer interaction. It does not imply that a value has been chosen.
- **Pressed** confirms that an input has been received. It is temporary.
- **Focus** shows where keyboard interaction is directed. See [Focus](../foundations/focus.md).
- **Selected** communicates a chosen value and persists after the pointer leaves. See [Selection](./selection.md).
- **Disabled** communicates that an element is unavailable.
- **Loading** communicates that content or an action is in progress. See [Loading](./loading.md).

## Combining states

States can coexist. A selected item may also be hovered or focused. Each meaning must remain discernible without one state obscuring another.

Focus must remain visible alongside hover and selection. Persistence alone does not determine which visual cue takes precedence.

## Dragging

During a drag, feedback must communicate the source and the current candidate target or tentative result. Unrelated hover previews should not compete with that feedback.

The visual element that tracks the gesture depends on the interaction model. A drag indicator may represent a tentative value or destination; it is not necessarily the same element as the hover highlight.

For interactions that commit a value on release, the committed value must remain unchanged until the action is completed. See [Drag](./drag.md).

## Touch

Touch does not provide persistent hover input, although a platform may produce or retain hover-like styling after touch interaction.

A design must not depend on hover to reveal essential information or make an action available. Press feedback should remain temporary, and the interaction must remain understandable without hover.

## Disabled

A disabled element should communicate unavailability without becoming unreadable. It must not appear to accept an action that it cannot perform.

Whether an unavailable element remains focusable depends on its semantics and interaction model. See [Accessibility](../foundations/accessibility.md).

## Principle

Each state has a distinct meaning. When states coexist, users must still be able to tell what is focused, what is highlighted, what is selected, and what is unavailable.
