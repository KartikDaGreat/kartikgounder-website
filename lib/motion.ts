/**
 * Shared motion vocabulary. Everything animates transform + opacity only:
 * colors belong to the 300ms theme transition in globals.css, and animating
 * them here would fight it.
 */

/** Enter easing, cubic-bezier(0.16, 1, 0.3, 1). Matches the CSS enter curve. */
export const EASE = [0.16, 1, 0.3, 1] as const
