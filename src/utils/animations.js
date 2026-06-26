// Shared animation variants — premium Framer Motion patterns

export const fadeUpBlur = {
  hidden: { opacity: 0, y: 20, filter: "blur(6px)" },
  show: {
    opacity: 1, y: 0, filter: "blur(0px)",
    transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export const springCard = {
  hidden: { opacity: 0, y: 36, scale: 0.95 },
  show: {
    opacity: 1, y: 0, scale: 1,
    transition: { type: "spring", stiffness: 90, damping: 20 },
  },
};

export const springRight = {
  hidden: { opacity: 0, x: 24, scale: 0.97 },
  show: {
    opacity: 1, x: 0, scale: 1,
    transition: { type: "spring", stiffness: 90, damping: 22 },
  },
};

export const stagger = (delay = 0, staggerChildren = 0.09) => ({
  hidden: {},
  show: { transition: { staggerChildren, delayChildren: delay } },
});

export const VIEWPORT = { once: true, margin: "-60px" };
export const VIEWPORT_EARLY = { once: true, margin: "-20px" };
