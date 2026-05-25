/**
 * Design system constants
 *
 * Single source of truth for brand colours and layout breakpoints.
 * Use these in logic/JS; the CSS equivalents live in globals.css (@theme).
 */

// ---------------------------------------------------------------------------
// Brand colours
// ---------------------------------------------------------------------------
export const COLORS = {
  brand: {
    /** Rich near-black for body text and primary backgrounds */
    black: '#1A1A1A',
    /** Warm gold accent — CTAs, highlights, luxury cues */
    gold:  '#C9A961',
    /** Deep red — alerts, sold badges, urgency indicators */
    red:   '#B33A3A',
    /** Pure white — card backgrounds, contrast surfaces */
    white: '#FFFFFF',
    /** Light warm grey — section fills, subtle dividers */
    gray:  '#F5F5F5',
  },
} as const;

// ---------------------------------------------------------------------------
// Responsive breakpoints (mirrors Tailwind v4 defaults)
// ---------------------------------------------------------------------------
export const BREAKPOINTS = {
  sm:  640,   // Small devices (landscape phones)
  md:  768,   // Tablets
  lg:  1024,  // Laptops / desktops
  xl:  1280,  // Large desktops
  '2xl': 1536, // Extra large desktops
} as const;

// ---------------------------------------------------------------------------
// Type helpers
// ---------------------------------------------------------------------------
export type BrandColor     = keyof typeof COLORS.brand;
export type BreakpointKey  = keyof typeof BREAKPOINTS;
