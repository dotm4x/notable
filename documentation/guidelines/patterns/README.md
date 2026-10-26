# Patterns

Patterns describe interaction behaviors that recur across many components. They explain how a state looks and moves, how the user chooses, how popups appear, and how loading is communicated. A pattern is reusable: a designer should find it in every component where its situation applies.

## Guidelines in this category

- [States](./states.md): the interaction states an element can be in, and how they combine.
- [Selection](./selection.md): highlighted, selected, and current, and why they are different.
- [Highlight](./highlight.md): the moving highlight that follows the user through a group of options.
- [Drag](./drag.md): pressing and moving along a group to choose a value, with its commitment, cancellation, and alternatives.
- [Popups](./popups.md): floating content that appears in response to an action.
- [Loading](./loading.md): placeholders and loading feedback.

## Relationship to the other categories

Patterns combine [Foundations](../foundations/README.md) into behaviors. They express the [Principles](../principles/README.md) in a specific situation. [Components](../components/README.md) use patterns, and a component guideline should link to the pattern rather than restate it.

A pattern should be added only when a behavior recurs. A single unique behavior belongs in the component guideline that owns it.
