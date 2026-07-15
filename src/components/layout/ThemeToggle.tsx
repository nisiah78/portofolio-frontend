"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/Icon";

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
      className="flex min-w-[74px] items-center justify-center gap-1.5 rounded-lg border border-line px-2.5 py-1.5 font-mono text-[11px] font-medium text-muted transition-colors hover:border-accent hover:text-accent"
    >
      {mounted && (
        <>
          <Icon name={isDark ? "moon" : "sun"} size={13} />
          {target}
        </>
      )}
    </button>
  );
}
