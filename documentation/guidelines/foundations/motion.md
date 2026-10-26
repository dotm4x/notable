# Motion

Motion is part of Notable's identity and one of its main ways of communicating change. It should feel fluid, responsive, and purposeful. Motion is never decoration for its own sake. It shows the user what changed, where it came from, and where it went.

## Purpose

Motion should do one of four things:

- Show the relationship between a before and an after, as in a highlight moving between options.
- Confirm that the user's input was received, as in a press response.
- Bring a temporary element into view and remove it, as in a popup.
- Indicate that something is in progress, as in a loading placeholder.

If motion does none of these, remove it. See [Restraint](../principles/restraint.md).

## Character

Motion for movement that follows the user, such as a highlight travelling between options, should feel springy. The movement settles quickly and does not overshoot in a way that calls attention to itself. Motion for fades, entrances, and exits should feel calm and direct. Bounce is not part of the vocabulary for exits or for content that the user is reading.

Motion should be fluid. Interrupting a movement should redirect it, not restart it.

## Timing

Direct feedback, such as a press or a change of state, should be quick enough to feel immediate. Larger movements may take slightly longer, but never long enough that the interface feels sluggish. Exits should be shorter than entrances, because the user has already made their decision.

## Initial placement

When an element first appears, it should be in its correct place from the first frame. Movement applies to changes after that. Animating an element from a wrong position into the right one suggests a mistake.

## Reduced motion

When the user prefers reduced motion, movement must be replaced by an instant change or a simple fade. The information that the movement carried must still be available. A highlight that jumps to its new target still shows the user where it is, even though it does not glide.

Following the pointer during a direct manipulation gesture is not decorative movement, because the user is moving the object themselves. It may remain connected to the pointer under reduced motion while easing and settling are removed. Decorative pointer-following effects, such as a loading spotlight, are not direct manipulation and may be removed entirely. See [Drag](../patterns/drag.md) and [Loading](../patterns/loading.md).

## Principle

Motion should explain change. It should feel alive without distracting, and it should always be possible to use the interface without it.

## Open question

Whether the press response should be the same for every kind of action, or whether a value change and a navigation should feel different.
