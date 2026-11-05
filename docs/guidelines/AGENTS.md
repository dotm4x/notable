# AGENTS.md — One design guidelines

`docs/guidelines/` defines the One design language. It is the authoritative source for design decisions and is independent of any implementation.

Follow the root `AGENTS.md`. This file covers only how to write and change the guidelines.

## 1. Authority and scope

- These documents define design intent, not code, styling, or framework APIs.
- A rule must remain valid if an implementation changes.
- Implementations follow the guidelines. They do not extend the design language through code.
- When a guideline and an implementation disagree, investigate both and determine which one is wrong.

## 2. Structure and ownership

The guidelines form four layers, each resting on the one above:

- `principles/`: why a rule exists.
- `foundations/`: visual, spatial, typographic, motion, and accessibility rules.
- `patterns/`: recurring interaction behavior.
- `components/`: reusable behavioral contracts for primitives.

Rules:

- State a rule in exactly one place and link to its owner instead of repeating it.
- When a document repeats another document's rule, remove the repetition and link.
- When a decision conflicts with a principle, the principle wins. Revise the decision or record it as an exception with its reason.
- Do not add a component rule that only restates a foundation or pattern.
- Follow each layer's `README.md` index when adding or moving documents.

## 3. Writing rules

- Describe intent and the reason behind it. Explain consequences that are not obvious.
- Use normative, consistent language and the terminology established by the guidelines and implementations.
- Keep examples conceptual and technology-independent.
- Do not include implementation workarounds, framework APIs, class names, or code.
- Do not duplicate implementation documentation. Keep it in the relevant area's `AGENTS.md` or technical documentation.
- Keep headings and cross-links accurate.

## 4. Changing the guidelines

1. Read the target document, its `README.md`, and the related principles, foundations, and patterns.
2. Search for other documents that already own part of the rule.
3. Determine whether the change is a genuine gap, a contradiction, or a platform-specific difference.
4. Make the smallest coherent change, and update affected links, indexes, and examples.
5. If the change affects implementations, update their documentation and code, or report the required follow-up.

Do not redefine shared guidance to match one implementation's incidental behavior.

## 5. Review checklist

- The rule lives in the correct layer.
- No rule is duplicated; related documents link to the owner.
- Terminology matches the rest of the guidelines and the implementations.
- No implementation-specific details or code.
- Examples illustrate intent without implying an API.
- Links and indexes resolve.
- `pnpm format:check` passes for the changed files.
