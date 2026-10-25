/**
 * Motion tokens for use with Motion's JavaScript/TypeScript API.
 *
 * These values mirror the CSS custom properties defined in
 * `tokens/motion.css`. Because CSS custom properties cannot be passed
 * directly into Motion's `Transition` option, they are maintained here as
 * typed constants that must be kept in sync with the CSS file.
 *
 * Durations are expressed in seconds, as required by Motion.
 * The corresponding CSS properties use milliseconds.
 */

// ---------------------------------------------------------------------------
// Durations (seconds)
// ---------------------------------------------------------------------------

/** 0.14 s — fast interactions: button, checkbox, input, segmented-control. */
export const DURATION_FAST = 0.14 as const;

/** 0.16 s — base interactions: switch, tooltip, avatar. */
export const DURATION_BASE = 0.16 as const;

/** 0.8 s — continuous animations: spinner rotation. */
export const DURATION_SLOW = 0.8 as const;

// ---------------------------------------------------------------------------
// Easing
// ---------------------------------------------------------------------------

/**
 * Standard CSS `ease` expressed as a cubic-bezier for Motion.
 * Equivalent to `--notable-easing-standard`.
 */
export const EASING_STANDARD = [0.25, 0.1, 0.25, 1] as const;

/**
 * Spring-like cubic-bezier used for element entry (e.g. tooltip).
 * Equivalent to `--notable-easing-spring`.
 */
export const EASING_SPRING = [0.2, 0.8, 0.2, 1] as const;

// ---------------------------------------------------------------------------
// Reusable Motion spring configs
//
// These are genuinely shared across components that use Motion's spring type.
// Spring configs are intentionally not represented as CSS variables because
// Motion's spring physics engine does not map to CSS timing functions.
// ---------------------------------------------------------------------------

/**
 * Press / hover scale spring for interactive elements (Button).
 * stiffness: 400, damping: 25.
 */
export const SPRING_INTERACTIVE = {
  type: 'spring',
  stiffness: 400,
  damping: 25,
} as const;

/**
 * Layout transition spring for sliding indicators (SegmentedControl).
 * stiffness: 450, damping: 35.
 */
export const SPRING_LAYOUT = {
  type: 'spring',
  stiffness: 450,
  damping: 35,
} as const;
