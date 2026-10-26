# Shape

Shape is one of the main ways Notable expresses its friendly character. Corners, borders, and curves signal approachability. A consistent shape language also tells the user which elements belong together.

## Corners

Corners follow a consistent scale. Larger containers and popups use a larger radius, and small controls use a smaller one. Corners scale with the size of the element, so a small control never looks like a miniature container.

Nested elements should use a smaller radius than the element that contains them. This keeps curves concentric, so the inner shape looks like it belongs inside the outer one rather than fighting it.

## Borders

Borders define an edge that the surface change alone cannot. Use a light border when a surface needs definition against its background. Do not add a border where a change in surface already separates the content.

## Full rounding

Fully rounded shapes, such as capsules and circles, are reserved for small, self-contained elements: status markers, badges, avatars, and switches. Large containers and text fields should not be fully rounded, because the curve would reduce the space available for content.

## Shape across components

Components of the same kind share a shape language. A component may vary in size, but it keeps its family's curve. Two components that appear side by side should not feel like they come from different systems.

## Principle

Shape should feel warm and approachable without sacrificing structure. The user should always be able to tell where one element ends and another begins.

## Open question

Whether a single radius family should apply to every size, or whether dense controls such as those in popups should use a tighter curve.
