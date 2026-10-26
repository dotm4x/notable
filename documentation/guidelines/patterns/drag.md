# Drag

Dragging is a form of direct manipulation. The user presses a source, moves the pointer or touch contact, and releases to complete or cancel an action.

Dragging should make the relationship between movement and its potential result clear. It is an input method, not a visual treatment: the appropriate feedback depends on what the interaction changes.

## When dragging applies

Use dragging when movement has a meaningful relationship to a target, position, or value. Do not add it when the movement provides no useful information or when it makes an action harder to discover.

Dragging must remain an optional input method. Users must have another accessible way to reach the same meaningful outcome. See [Accessibility](../foundations/accessibility.md).

## Starting a drag

A drag begins from a meaningful source. The interaction must distinguish an intentional drag from an ordinary press, click, or scroll gesture.

A press without meaningful movement should remain an ordinary press. Use an appropriate movement threshold to avoid starting a drag because of incidental pointer motion.

## Tracking and feedback

During a drag, provide clear feedback about the source, the current candidate target, and the result that would follow from release.

The feedback must stay connected to the user's movement and remain within the interaction's valid bounds. The user must be able to revise the candidate target before committing the action.

The visual element that follows the gesture depends on the interaction. It may be a movable object, a preview, or an indicator representing a tentative value. Do not assume that every drag uses a highlight, or that every moving indicator represents a highlight.

Disabled or unavailable targets must not accept the action. Feedback must not imply that an unavailable target is valid.

## Completion and cancellation

Commit the action only when the user releases in a valid state defined by the interaction model.

Releasing outside a valid target may cancel the action or resolve it according to an explicitly defined boundary rule. The behavior must be predictable and must not silently commit an unintended result.

When the gesture is cancelled or interrupted, restore the previous committed state unless the interaction explicitly defines another safe outcome.

A completed drag must not also trigger an unintended click or second action from the same release.

## Focus and keyboard

Pointer movement alone does not determine keyboard focus. Focus behavior after a drag must remain consistent with the interaction's keyboard model.

Users must be able to reach the same meaningful outcomes without dragging. Navigation, candidate movement, and commitment should follow the semantics of the interaction rather than assume that all controls behave alike.

See [Focus](../foundations/focus.md) and [Accessibility](../foundations/accessibility.md).

## Touch

Distinguish movement along the intended gesture axis from movement that should scroll surrounding content. Preserve ordinary scrolling wherever possible.

When a gesture could reasonably mean either dragging or scrolling, the interaction must provide a predictable way to determine the intended action before committing a change.

## Reduced motion

Direct manipulation must remain connected to the user's movement when reduced motion is preferred. Remove decorative easing and settling where appropriate, without hiding the current target or the result of the gesture.

See [Motion](../foundations/motion.md).

## Related guidance

- [Highlight](./highlight.md) defines the temporary visual indication of an interaction target.
- [Selection](./selection.md) distinguishes a committed value from a temporary target.
- [States](./states.md) defines how interaction states remain distinguishable.

## Open question

Should completing a drag move keyboard focus to the resulting target? The system-wide behavior has not yet been established.

## Principle

Dragging should make an action feel intentional and continuous. The user must understand the potential result before release and be able to recover safely when the gesture is cancelled.
