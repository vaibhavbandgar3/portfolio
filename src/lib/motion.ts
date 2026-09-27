import type { Transition, Variants } from "motion/react";

/** The site's single easing curve — also available in CSS as --ease-out-expo. */
export const ease = [0.22, 1, 0.36, 1] as const;

export const duration = { fast: 0.35, base: 0.6, slow: 0.9 } as const;

export const transition: Transition = { duration: duration.base, ease };

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition },
};

export const stagger = (staggerChildren = 0.08, delayChildren = 0): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren, delayChildren } },
});

/** Reveal once, a little before the element is fully in view. */
export const viewportOnce = { once: true, margin: "0px 0px -12% 0px" } as const;
