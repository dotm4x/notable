# Drag

Dragging is direct manipulation: the user presses a source, moves it, and releases to complete or cancel an action. A drag should make the relationship between the user's movement and the resulting change clear. It is distinct from hover, which previews a target without beginning an action, and focus, which marks the next keyboard destination.

## When dragging applies

Use dragging when movement across targets or along a track has a clear meaning, such as choosing among adjacent values or moving an object to a destination. Do not add it to independent actions or unrelated targets where the path carries no useful information.

Dragging is an optional input method, not a prerequisite. Provide a keyboard and assistive-technology path to the same outcome. See [Accessibility](../foundations/accessibility.md).

## Start and tracking

A drag begins from a meaningful source. In a group that represents a range of choices, starting from the active choice can make the movement continuous; in direct manipulation of a movable object, the object itself is the source. A press without meaningful movement remains a press, not a drag.

While dragging, provide clear feedback for the source and the current candidate target. Keep the movement connected to the pointer, respect the group's bounds, and make it possible to revise the target before release. Disabled or unavailable items are not valid targets. Feedback must not imply that an unavailable target will accept the action.

Suppress unrelated hover previews during the gesture so the drag feedback remains clear. Current selection-drag behavior does not explicitly suppress hover treatments, so their appearance may depend on pointer capture and platform. Its target measurement can include disabled items; releasing over one leaves the current selection unchanged and returns the indicator. These are implementation gaps, not the intended interaction.

## Completion and cancellation

Complete the action only when the user releases over a valid target. For a choice group, this commits the target on release; for a movable control on a track, the control's own rule determines how the release resolves. A transfer to a distinct destination should cancel if released outside a valid target. A bounded selection gesture may instead define an edge rule, such as resolving to the nearest end. If the gesture is interrupted, cancel without committing and restore the prior state.

The current selection-drag behavior resolves positions beyond the group to the nearest measured option rather than cancelling. Its edge rule should be explicit and must not make a disabled option appear to accept the action.

A completed drag must not also trigger a second action from the release. Treat release as the end of the gesture, not as a new press.

## Focus and keyboard

Pointer movement does not move keyboard focus. Focus behavior after a completed drag remains an open question below.

Keyboard users must be able to reach the same targets and complete the same action without dragging. Navigation and commitment should follow the semantics of the control; their relationship is not settled across all choice presentations. See [Choice](../components/choice.md) and [Focus](../foundations/focus.md).

## Touch

On touch devices, distinguish movement along the drag's intended axis from movement that should scroll the surrounding content. Preserve ordinary scrolling whenever possible. If a gesture could reasonably mean either action, do not commit until the intended action is clear.

Touch behavior depends on the target platform and gesture arbitration. The current implementation does not define this consistently for every selection group and orientation.

## Reduced motion

Direct manipulation remains connected to the user's movement when reduced motion is preferred. Remove decorative easing and settling; the result and target must remain clear. See [Motion](../foundations/motion.md).

## Related guidance

- A moving preview or target surface follows [Highlight](./highlight.md).
- Persistent values and temporary targets follow [Selection](./selection.md).
- State combinations during a gesture follow [States](./states.md).

## Open question

Should completing a drag move keyboard focus to the resulting target? Current selection-drag behaviors differ, and neither outcome is established as the system-wide rule.

## Principle

Dragging should make an action feel intentional and continuous. The user must be able to understand the target before release and recover safely when the gesture is cancelled.
