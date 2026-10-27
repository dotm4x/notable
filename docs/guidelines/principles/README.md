# Principles

Principles are the values that guide every design decision in Notable. They are short, stable, and independent of platform, component, or technology. When a specific rule is unclear or missing, a principle is the place to reason from.

## Guidelines in this category

- [Clarity](./clarity.md): every element communicates what it is and what state it is in.
- [Restraint](./restraint.md): expression serves the task, and consistency governs when variation is justified.
- [Expression](./expression.md): Notable feels warm, friendly, and a little playful.
- [Continuity](./continuity.md): the user can follow every change.

Accessibility is not listed here as a principle. It is a foundation, because it constrains every principle rather than competing with them. See [Accessibility](../foundations/accessibility.md).

## Relationship to the other categories

Principles set the direction for [Foundations](../foundations/README.md), which turn them into shared rules. Foundations inform [Patterns](../patterns/README.md), which describe recurring behaviors. [Components](../components/README.md) apply all three.

Principles also resolve tension between rules. For example, expression may shape a popup's entrance, but clarity determines that its content must be readable from its first frame.

## How the principles relate

The four principles are not equal in every decision. They form an order of precedence, which applies when they conflict.

- **Clarity** comes first. If the user cannot tell what an element is, what state it is in, or what will happen, nothing else justifies the design.
- **Continuity** serves clarity. Movement that shows how one state became another makes change understandable. Movement that is only transition for its own sake does not.
- **Expression** is bounded by clarity and restraint. It gives Notable its warmth and playfulness, but it must not obscure meaning.
- **Restraint** governs the amount of expression. It decides how much motion, color, and detail a moment can carry, and it keeps variation consistent.

## Trade-offs

Some trade-offs are unavoidable, and the guidelines should not hide them.

- **Expression versus speed.** A playful transition takes time. Short, direct feedback is preferred for frequent actions, and richer motion is reserved for moments that change context.
- **Continuity versus simplicity.** A traveling highlight is more work to build than a per-option background, and it is worth that cost only where the user benefits from following the movement.
- **Restraint versus delight.** A small playful detail is justified when it reinforces the feel of an interaction. It is not justified when it competes with the content.

When these trade-offs are resolved, the resolution should be recorded in the document that owns the rule, with its reason.
