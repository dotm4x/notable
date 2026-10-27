# Highlight

The highlight is a shared background surface that identifies the item currently under the pointer or reached through keyboard navigation. It moves between eligible targets, preserving continuity as attention moves through a group.

The highlight communicates a temporary interaction position. It does not, by itself, communicate which value is selected or which destination is current.

## Purpose

A moving surface connects successive interaction targets. Instead of independent backgrounds appearing and disappearing, one surface moves between targets, making the transition easier to follow.

Use this pattern when an interface benefits from a continuous visual indication of the current interaction target. Do not add a moving highlight to independent controls when their individual hover treatment already communicates the interaction clearly.

## Target

The highlight follows the target designated by the interaction model. That target may be determined by pointer position, keyboard navigation, or another supported interaction.

Only eligible targets may receive the highlight. Disabled or unavailable items must not appear actionable. Structural elements that cannot receive interaction are not targets.

The highlight must follow the actual target rather than infer its position from the pointer alone. This keeps pointer and keyboard interactions consistent.

## Appearance

The highlight sits behind the target's content. It must not obscure text, icons, shortcuts, selection indicators, or other meaningful information.

Its surface must remain distinguishable from its surroundings in both themes. Use the shared highlight color role rather than introducing a new color for each context. See [Colors](../foundations/colors.md).

The highlight must not change layout, target size, or the position of surrounding content.

## Movement

The highlight moves and resizes to match its target. It should respond to changes in target position and dimensions, including changes caused by layout, scrolling, or updated content.

Movement should remain responsive to rapid input. When the target changes before the previous movement finishes, the highlight should redirect toward the latest target rather than wait for the previous transition to finish.

When a target first appears, the highlight should begin in the correct position instead of visibly travelling from an unrelated location.

## Relationship to selection and focus

Highlight, focus, selection, and current position have different meanings. They may refer to the same item, but one must not be used as an implicit substitute for another.

A selected value must remain identifiable when the highlight moves elsewhere. A focus indicator must remain visible alongside the highlight. A current-position indicator must not be obscured by the highlight.

A selection indicator that moves to represent a chosen value is a separate visual mechanism. It must not be treated as a highlight merely because both surfaces move.

See [Selection](./selection.md), [States](./states.md), and [Focus](../foundations/focus.md).

## Dragging

A highlight does not automatically become the indicator for a drag operation. During direct manipulation, the interaction model determines which visual element tracks the candidate target or tentative value.

Unrelated hover previews should not compete with drag feedback. If the highlight and the drag indicator serve different purposes, preserve that distinction.

See [Drag](./drag.md).

## Touch

Touch does not provide persistent hover input. The highlight should respond to the interaction states supported by the target environment, without requiring hover to discover information or complete an action.

See [States](./states.md).

## Reduced motion

When reduced motion is preferred, the highlight must still identify its target. Replace travel with an immediate position change or a simple fade, as appropriate.

Direct manipulation must remain understandable and connected to the user's input. See [Motion](../foundations/motion.md).

## Principle

The highlight shows where interaction is directed now. It must remain distinct from what has been chosen, where focus rests, and which position is current.
