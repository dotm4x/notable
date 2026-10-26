/**
 * Motion tokens for use with Motion's JavaScript/TypeScript API.
 *
 * Internal module: it is not exported from the package entry point.
 *
 * These values mirror the CSS custom properties defined in
 * `tokens/motion.css`. Because CSS custom properties cannot be passed
 * directly into Motion's `Transition` option, they are maintained here as
 * typed constants that must be kept in sync with the CSS file. CSS-only
 * tokens, such as `--notable-duration-medium`, are not mirrored here.
 *
 * Durations are expressed in seconds, as required by Motion.
 * The corresponding CSS properties use milliseconds.
 */

// ---------------------------------------------------------------------------
// Durations (seconds)
// ---------------------------------------------------------------------------

/** 0.14 s. Equivalent to `--notable-duration-fast`. */
export const DURATION_FAST = 0.14 as const;

/** 0.16 s. Equivalent to `--notable-duration-base`. */
export const DURATION_BASE = 0.16 as const;

/** 0.8 s. Equivalent to `--notable-duration-slow`. */
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
 * Ease-out cubic-bezier. Equivalent to `--notable-easing-spring`.
 */
export const EASING_SPRING = [0.2, 0.8, 0.2, 1] as const;

// ---------------------------------------------------------------------------
// Motion spring configs
//
// Motion's spring physics does not map to CSS timing functions, so these
// configs are defined here rather than as CSS variables.
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
 * Layout transition spring for sliding indicators (SegmentedControl and Tabs).
 * stiffness: 450, damping: 35.
 */
export const SPRING_LAYOUT = {
  type: 'spring',
  stiffness: 450,
  damping: 35,
} as const;

/**
 * Travel spring for the shared hover highlight (Select, Combobox).
 * stiffness: 500, damping: 46. Slightly over-damped, so the highlight
 * settles without overshooting between options.
 */
export const SPRING_HIGHLIGHT = {
  type: 'spring',
  stiffness: 500,
  damping: 46,
} as const;
