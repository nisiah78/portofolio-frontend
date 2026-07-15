"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type LimelightNavItem = {
  id: string | number;
  icon: React.ReactNode;
  label?: string;
  onClick?: () => void;
};

type LimelightNavProps = {
  items?: LimelightNavItem[];
  activeIndex?: number;
  defaultActiveIndex?: number;
  onTabChange?: (index: number) => void;
  className?: string;
  limelightClassName?: string;
  iconContainerClassName?: string;
  iconClassName?: string;
  /** When true, repositions the limelight (call after becoming visible). */
  visible?: boolean;
};

/**
 * Adaptive-width nav with a limelight highlight that slides under the active item.
 */
export function LimelightNav({
  items = [],
  activeIndex: controlledIndex,
  defaultActiveIndex = 0,
  onTabChange,
  className,
  limelightClassName,
  iconContainerClassName,
  iconClassName,
  visible = true,
}: LimelightNavProps) {
  const [internalIndex, setInternalIndex] = useState(defaultActiveIndex);
  const activeIndex = controlledIndex ?? internalIndex;
  const [isReady, setIsReady] = useState(false);
  const navItemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const limelightRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (!visible || items.length === 0) return;

    const limelight = limelightRef.current;
    if (!limelight) return;

    const place = () => {
      const activeItem = navItemRefs.current[activeIndex];
      if (!activeItem) return;
      const newLeft =
        activeItem.offsetLeft + activeItem.offsetWidth / 2 - limelight.offsetWidth / 2;
      limelight.style.left = `${newLeft}px`;
    };

    // Double-rAF: wait until opacity/layout settle after the sticky swap.
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(place);
    });
    place();

    if (!isReady) {
      const t = window.setTimeout(() => setIsReady(true), 50);
      return () => {
        cancelAnimationFrame(raf1);
        cancelAnimationFrame(raf2);
        window.clearTimeout(t);
      };
    }

    window.addEventListener("resize", place);
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      window.removeEventListener("resize", place);
    };
  }, [activeIndex, isReady, items, visible]);

  if (items.length === 0) return null;

  function handleItemClick(index: number, itemOnClick?: () => void) {
    if (controlledIndex === undefined) setInternalIndex(index);
    onTabChange?.(index);
    itemOnClick?.();
  }

  return (
    <nav
      className={cn(
        "relative inline-flex h-16 items-center rounded-xl border border-line bg-surface px-2 text-fg",
        className,
      )}
    >
      {items.map(({ id, icon, label, onClick }, index) => (
        <button
          key={id}
          type="button"
          ref={(el) => {
            navItemRefs.current[index] = el;
          }}
          className={cn(
            "relative z-20 flex h-full cursor-pointer items-center justify-center p-3 sm:p-5",
            iconContainerClassName,
          )}
          onClick={() => handleItemClick(index, onClick)}
          aria-label={label}
          aria-current={activeIndex === index ? "true" : undefined}
        >
          <span
            className={cn(
              "flex transition-opacity duration-100 ease-in-out [&_svg]:size-4 sm:[&_svg]:size-6",
              activeIndex === index ? "opacity-100" : "opacity-40",
              iconClassName,
            )}
          >
            {icon}
          </span>
        </button>
      ))}

      <div
        ref={limelightRef}
        className={cn(
          "absolute top-0 z-10 h-[5px] w-11 rounded-full bg-accent shadow-[0_50px_15px_var(--accent)]",
          isReady && "transition-[left] duration-400 ease-in-out",
          limelightClassName,
        )}
        style={{ left: -999 }}
        aria-hidden
      >
        <div className="pointer-events-none absolute top-[5px] left-[-30%] h-14 w-[160%] bg-linear-to-b from-accent/30 to-transparent [clip-path:polygon(5%_100%,25%_0,75%_0,95%_100%)]" />
      </div>
    </nav>
  );
}
