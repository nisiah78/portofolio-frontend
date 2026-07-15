"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Briefcase, Search, X } from "lucide-react";
import { history, type HistoryEntry } from "@/data/history";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { HISTORY_FOCUS_EVENT } from "@/lib/events";
import { cn } from "@/lib/utils";

const DEBOUNCE_MS = 400;

type Result = {
  entry: HistoryEntry;
  index: number;
  matchedStack: string[];
};

function search(query: string, entries: HistoryEntry[]): Result[] {
  const q = query.trim().toLowerCase();
  if (!q) {
    return entries.map((entry, index) => ({ entry, index, matchedStack: [] }));
  }

  return entries
    .map((entry, index) => {
      const matchedStack = entry.stack.filter((s) => s.toLowerCase().includes(q));
      const textHit =
        entry.role.toLowerCase().includes(q) ||
        entry.org.toLowerCase().includes(q) ||
        entry.summary.toLowerCase().includes(q) ||
        entry.highlights.some((h) => h.toLowerCase().includes(q));
      const score = matchedStack.length > 0 ? 2 : textHit ? 1 : 0;
      return { entry, index, matchedStack, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map(({ entry, index, matchedStack }) => ({ entry, index, matchedStack }));
}

export function SearchModal({
  open,
  onClose,
  locale,
  dict,
}: {
  open: boolean;
  onClose: () => void;
  locale: Locale;
  dict: Dictionary;
}) {
  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const entries = history[locale];

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [query]);

  const results = useMemo(() => search(debounced, entries), [debounced, entries]);

  // Reset the selection when the result set changes shape (render-time adjustment,
  // not an effect, so it doesn't trigger an extra commit).
  const [prevResultsLength, setPrevResultsLength] = useState(results.length);
  if (results.length !== prevResultsLength) {
    setPrevResultsLength(results.length);
    setActiveIndex(0);
  }

  // Same pattern: clear the query/selection the moment the modal opens.
  const [prevOpen, setPrevOpen] = useState(open);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setQuery("");
      setDebounced("");
      setActiveIndex(0);
    }
  }

  useEffect(() => {
    if (!open) return;
    const raf = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(raf);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  function selectResult(r: Result) {
    window.dispatchEvent(new CustomEvent(HISTORY_FOCUS_EVENT, { detail: { index: r.index } }));
    onClose();
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const r = results[activeIndex];
      if (r) selectResult(r);
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center bg-black/60 px-4 pt-[12vh] backdrop-blur-[2px]"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search experience by stack"
        onKeyDown={onKeyDown}
        className="w-full max-w-xl overflow-hidden rounded-xl border border-line bg-surface shadow-[0_40px_100px_-24px_rgba(0,0,0,0.7)]"
      >
        {/* Input row */}
        <div className="flex items-center gap-2.5 border-b border-line px-4 py-3">
          <Search className="size-4 shrink-0 text-faint" strokeWidth={2} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={dict.search.placeholder}
            aria-label={dict.search.placeholder}
            className="min-w-0 flex-1 bg-transparent font-mono text-[14px] text-fg placeholder:text-faint focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label={dict.search.close}
            className="rounded p-1 text-faint transition-colors hover:bg-fg/8 hover:text-fg"
          >
            <X className="size-3.5" />
          </button>
        </div>

        {/* Results */}
        <div ref={listRef} className="max-h-[52vh] overflow-y-auto p-1.5">
          {results.length === 0 ? (
            <div className="px-4 py-8 text-center font-mono text-[13px] text-muted">
              {dict.search.noResults} &ldquo;{query}&rdquo;
            </div>
          ) : (
            results.map((r, i) => {
              const isActive = i === activeIndex;
              return (
                <button
                  type="button"
                  key={`${r.entry.org}-${r.entry.period}`}
                  data-index={i}
                  onMouseEnter={() => setActiveIndex(i)}
                  onClick={() => selectResult(r)}
                  className={cn(
                    "flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors",
                    isActive ? "bg-accent/15" : "hover:bg-fg/5",
                  )}
                >
                  <Briefcase className="mt-0.5 size-4 shrink-0 text-accent" strokeWidth={2} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="truncate text-[13.5px] font-medium text-fg">
                        {r.entry.role} <span className="text-faint">·</span> {r.entry.org}
                      </span>
                      <span className="shrink-0 font-mono text-[11px] text-faint">
                        {r.entry.period}
                      </span>
                    </div>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {r.entry.stack.map((s) => {
                        const hit = r.matchedStack.includes(s);
                        return (
                          <span
                            key={s}
                            className={cn(
                              "rounded border px-1.5 py-0.5 font-mono text-[10.5px]",
                              hit
                                ? "border-accent/50 bg-accent/15 text-accent"
                                : "border-line text-muted",
                            )}
                          >
                            {s}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer hints */}
        <div className="flex items-center justify-between gap-3 border-t border-line px-4 py-2 font-mono text-[10.5px] text-faint">
          <span>
            {results.length} {results.length === 1 ? dict.search.result : dict.search.results}
          </span>
          <span className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-line bg-fg/5 px-1">↑</kbd>
              <kbd className="rounded border border-line bg-fg/5 px-1">↓</kbd> {dict.search.navigate}
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-line bg-fg/5 px-1">↵</kbd> {dict.search.select}
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-line bg-fg/5 px-1">Esc</kbd> {dict.search.close}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
