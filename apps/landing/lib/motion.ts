import { useReducedMotion } from 'motion/react';
import type { Transition, Variants } from 'motion/react';

const instant: Transition = { duration: 0 };

/**
 * `initial`/`animate` targets must stay identical between server and client
 * render (both always start from the "hidden" variant) so hydration never
 * disagrees — only the transition speed collapses to instant when the user
 * has requested reduced motion, applied post-mount.
 */
export function useReducedMotionSafe() {
  const reduced = useReducedMotion();
  return { reduced: !!reduced, transition: reduced ? instant : undefined };
}

/** The single orchestrated load sequence — used only by Hero. */
export const heroSequence: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
};

export const heroSequenceItem: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

/** Shared tab cross-fade, used by Hero and InteractiveDemo. */
export const tabCrossfade: Variants = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.2, ease: 'easeOut' } },
  exit: { opacity: 0, y: -6, transition: { duration: 0.15, ease: 'easeIn' } },
};

/** Accordion expand/collapse, used by FaqSection. */
export const accordionCollapse: Variants = {
  collapsed: { height: 0, opacity: 0 },
  expanded: { height: 'auto', opacity: 1, transition: { duration: 0.25, ease: 'easeOut' } },
};

/** Mobile nav sheet slide-in, used by Navbar. */
export const sheetSlide: Variants = {
  hidden: { x: '100%' },
  visible: { x: 0, transition: { duration: 0.25, ease: 'easeOut' } },
  exit: { x: '100%', transition: { duration: 0.2, ease: 'easeIn' } },
};

export const sheetOverlay: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};
