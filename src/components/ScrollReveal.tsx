import { motion, useInView } from "framer-motion";
import { useRef, ReactNode, forwardRef } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "right";
}

const ScrollReveal = forwardRef<HTMLDivElement, ScrollRevealProps>(
  ({ children, className = "", delay = 0, direction = "up" }, forwardedRef) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-60px" });

    const initial = {
      opacity: 0,
      y: direction === "up" ? 40 : 0,
      x: direction === "left" ? -40 : direction === "right" ? 40 : 0,
    };

    return (
      <motion.div
        ref={ref}
        initial={initial}
        animate={isInView ? { opacity: 1, y: 0, x: 0 } : initial}
        transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
        className={className}
      >
        {children}
      </motion.div>
    );
  }
);

ScrollReveal.displayName = "ScrollReveal";

export default ScrollReveal;
