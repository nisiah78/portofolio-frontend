"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Gate theme-dependent UI until after hydration (next-themes recommended pattern).
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";
  const target = isDark ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(target)}
      aria-label={`Switch to ${target} theme`}
      className={cn(
        "relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-line",
        "bg-surface text-muted shadow-sm transition-colors hover:border-accent hover:text-accent",
      )}
    >
      {mounted && (
        <AnimatePresence initial={false}>
          {/* The outgoing icon rises out of frame while the incoming one rises in
              from below — like the sun setting as the moon rises, and vice versa. */}
          <motion.span
            key={isDark ? "moon" : "sun"}
            initial={{ y: 14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -14, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.34, 1.15, 0.64, 1] }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Icon name={isDark ? "moon" : "sun"} size={16} />
          </motion.span>
        </AnimatePresence>
      )}
    </button>
  );
}
