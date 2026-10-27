# Choice

A choice lets the user select one value from a set of mutually exclusive options. Choosing one option means the others are not chosen. Choice is the most common primitive in Notable. It can be presented as a list that opens from a trigger or as a group of options shown together; the value retains the same meaning in either presentation.

## What a choice is

A choice answers the question "which value do I want?" The chosen value is data the user sets. It is not a place the user is in, which is the distinction that separates a choice from [Views](./views.md).

Each option has a name the user can read. A choice has a name that describes what is being chosen, such as "Language" or "Time range". That name must be available to every user, whether or not it is visible. See [Accessibility](../foundations/accessibility.md).

## Presentations

Both presentations retain the same meaning. The difference is how many options fit and how the user compares them; navigation details may vary as described under [Keyboard](#keyboard).

- **Options shown together** suit a small set of options that the user compares at a glance. All options are visible at once, and the chosen one is marked in place.
- **Options in a popup** suit a larger set. The chosen value is visible on the trigger, and the full set appears when the user opens it. See [Popups](../patterns/popups.md).

A choice must not change its meaning between presentations. A user who learns the behavior in one should recognize it in the other.

## Highlight, selection, and commitment

Where the pointer or keyboard position previews an option independently of its value, it follows [Highlight](../patterns/highlight.md). A preview is not itself a choice. Depending on the interaction model, keyboard movement may either preview an option or commit it.

A value changes when the user commits to an option. Committing happens through a press, a confirming key on the highlighted option, arrow-key movement in models that activate on focus, or the release of a drag. See [Drag](../patterns/drag.md). A popup choice closes after commitment. Focus behavior follows [Popups](../patterns/popups.md): a trigger-based select returns focus to its trigger, while a field with suggestions keeps focus in the field.

The chosen value stays visible while the highlight is elsewhere. See [Selection](../patterns/selection.md).

## Chosen options need more than color

A chosen option must be recognizable without color. In a list the user scans, type weight alone is too subtle to be reliable, so a chosen option should also carry a distinct mark, such as a check. In a group shown together, the selection indicator serves as that mark; any separate preview highlight must remain visually distinct.

## Disabled options

A disabled option is visible and readable, but it cannot be chosen or committed. Ordinary keyboard and pointer navigation should skip it and not highlight it. During a drag, the indicator must not move onto a disabled option, and releasing over one keeps the previous value. See [States](../patterns/states.md) and [Drag](../patterns/drag.md).

## Keyboard

Arrow keys move through enabled options in the direction of the group. Home and End should move to the first and last enabled options. In a popup, arrow keys move the highlight without changing the value; a confirming key commits it, and Escape dismisses the list without changing the value.

Keyboard commitment depends on presentation. A grouped choice shown together commits as focus moves, so the value follows the arrow keys. A popup choice moves the highlight only, and a confirming key commits it. Views switched by a grouped choice update as focus moves.

Focus follows [Focus](../foundations/focus.md).

Some grouped-choice implementations rely on platform-default Home and End behavior rather than defining it consistently. First- and last-option navigation is therefore not guaranteed across presentations.

## Accessibility

A chosen option must be communicated to assistive technology, not only shown visually. Each option's name must include its visible text. See [Accessibility](../foundations/accessibility.md).

## Principle

A choice should make the chosen value obvious, make the options easy to compare, and never change the value without a deliberate commitment.
