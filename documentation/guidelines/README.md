# Notable Design Guidelines

Notable is a friendly, expressive interface system. It is built for people who use software daily and want it to feel approachable, responsive, and clear. These guidelines describe how Notable interfaces should look, move, and behave. They describe design intent, not any particular implementation, and they apply to every platform Notable supports.

## How the guidelines are organized

The guidelines form four layers. Each layer rests on the one above it.

- [Principles](./principles/README.md) are the values behind every decision.
- [Foundations](./foundations/README.md) define the shared visual, spatial, typographic, motion, and accessibility rules.
- [Patterns](./patterns/README.md) describe reusable interaction behaviors, such as selection, the moving highlight, dragging, and popups.
- [Components](./components/README.md) are the fundamental, reusable interaction primitives. Finished widgets are compositions of these primitives, patterns, and foundations.

## How the layers relate

A principle decides what a rule is for. A foundation states the rule. A pattern applies rules to a recurring interaction. A component primitive defines a reusable behavioral contract and relies on patterns and foundations for everything it shares with other primitives.

When a document repeats a rule owned by another document, remove the repetition and link to the owner. When a decision conflicts with a principle, the principle wins, and the decision should be revised or documented as an exception with its reason.

## Using these guidelines

Use them when you design a new component, add a state, change motion, or review an interface. Start with the principles. Then check the foundations and patterns that apply. Describe a new component as a composition of primitives where possible. If a new behavior does not fit an existing primitive or pattern, document the reason before inventing one.

The guidelines do not define code, styling, or framework APIs. A rule remains valid if the implementation changes.

## Open questions

Some decisions are not yet settled. They are marked **Open question** in the document where they arise. The main ones are:

- Whether focus should use one visual treatment everywhere, or adapt to tight containers. See [Focus](foundations/focus.md).
- Whether arrow-key navigation should commit in every choice presentation. See [Choice](components/choice.md).
- Whether committing a drag should move focus to the chosen option. See [Drag](patterns/drag.md).
- Whether the press response should be the same for every kind of action. See [Motion](foundations/motion.md).
- Whether the pointer-following spotlight belongs on non-interactive loading placeholders. See [Loading](patterns/loading.md).
- Whether one radius family should cover every size. See [Shape](foundations/shape.md).
- Whether dialogs and drawers should share popup surfaces or use distinct treatments. See [Elevation](foundations/elevation.md).
