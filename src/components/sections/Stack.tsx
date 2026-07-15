"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { stack, type StackCategory } from "@/data/stack";

// ─── Types ───────────────────────────────────────────────────────────────────

type View = "Catégories" | "Sous-groupes" | "Tout";

type Connector = {
  id: string;
  from: string;
  to: string;
  cat: string;
  d: string;
};

type Tip = {
  show: boolean;
  x: number;
  y: number;
  label: string;
  desc: string;
  color: string;
};

// ─── Tree maps — built once from data ────────────────────────────────────────

const colorOf: Record<string, string> = {};
const parentOf: Record<string, string> = {};
const childrenOf: Record<string, string[]> = { root: [] };
const edges: Array<{ id: string; from: string; to: string; cat: string }> = [];
let totalTechs = 0;

function addEdge(from: string, to: string, cat: string) {
  edges.push({ id: `${from}__${to}`, from, to, cat });
  parentOf[to] = from;
  childrenOf[from] = childrenOf[from] ?? [];
  childrenOf[from].push(to);
}

stack.forEach((cat) => {
  colorOf[cat.id] = cat.color;
  addEdge("root", cat.id, cat.id);
  cat.subgroups.forEach((sub) => {
    addEdge(cat.id, sub.id, cat.id);
    sub.techs.forEach((t) => {
      addEdge(sub.id, t.id, cat.id);
      totalTechs++;
    });
  });
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

function hoverSet(id: string): Set<string> {
  const set = new Set<string>([id]);
  let p = parentOf[id];
  while (p) { set.add(p); p = parentOf[p]; }
  const queue = [id];
  while (queue.length) {
    const cur = queue.pop()!;
    (childrenOf[cur] ?? []).forEach((c) => { set.add(c); queue.push(c); });
  }
  return set;
}

function initExpanded(view: View): Record<string, boolean> {
  const exp: Record<string, boolean> = {};
  stack.forEach((cat) => {
    exp[cat.id] = view !== "Catégories";
    cat.subgroups.forEach((s) => { exp[s.id] = view === "Tout"; });
  });
  return exp;
}

function abbr(label: string): string {
  const words = label.split(/[^A-Za-z0-9]+/).filter(Boolean);
  if (words.length > 1) return (words[0][0] + words[1][0]).toUpperCase();
  return (words[0] ?? label).slice(0, 2).toUpperCase();
}

/** Derive a float animation delay (0–2 s) from the node id so each node is out of phase */
function floatDelay(id: string): string {
  const hash = id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return `${((hash % 20) * 0.1).toFixed(1)}s`;
}

/** Float duration slightly varied per node (3.6–5.4 s) */
function floatDuration(id: string): string {
  const hash = id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return `${3.6 + (hash % 10) * 0.18}s`;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function Stack() {
  const defaultView: View = "Sous-groupes";

  const [view, setViewState] = useState<View>(defaultView);
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() =>
    initExpanded(defaultView),
  );
  const [filter, setFilter] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [connectors, setConnectors] = useState<Connector[]>([]);
  const [tip, setTip] = useState<Tip>({
    show: false, x: 0, y: 0, label: "", desc: "", color: "#22d3ee",
  });
  // Below the mobile breakpoint the tree inverts: root on top, flowing down instead of right.
  const [vertical, setVertical] = useState(false);

  const stageRef = useRef<HTMLDivElement>(null);
  const sigRef = useRef("");
  const rafRef = useRef(0);
  const rtRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [panelH, setPanelH] = useState<number | undefined>(undefined);

  // ── Connector measurement ──────────────────────────────────────────────────

  const measure = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const base = stage.getBoundingClientRect();
    const map: Record<string, { l: number; r: number; t: number; b: number; cx: number; cy: number }> = {};
    stage.querySelectorAll<HTMLElement>("[data-node-id]").forEach((el) => {
      const r = el.getBoundingClientRect();
      map[el.dataset.nodeId!] = {
        l: r.left - base.left,
        r: r.right - base.left,
        t: r.top - base.top,
        b: r.top - base.top + r.height,
        cx: r.left - base.left + r.width / 2,
        cy: r.top - base.top + r.height / 2,
      };
    });
    const cons: Connector[] = [];
    edges.forEach((e) => {
      const a = map[e.from];
      const b = map[e.to];
      if (!a || !b) return;
      let d: string;
      if (vertical) {
        // Top-down: from the bottom-center of the parent to the top-center of the child.
        const x1 = a.cx, y1 = a.b, x2 = b.cx, y2 = b.t;
        const dy = Math.max(28, (y2 - y1) * 0.5);
        d = `M${x1.toFixed(1)},${y1.toFixed(1)} C${x1.toFixed(1)},${(y1 + dy).toFixed(1)} ${x2.toFixed(1)},${(y2 - dy).toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)}`;
      } else {
        const x1 = a.r, y1 = a.cy, x2 = b.l, y2 = b.cy;
        const dx = Math.max(28, (x2 - x1) * 0.5);
        d = `M${x1.toFixed(1)},${y1.toFixed(1)} C${(x1 + dx).toFixed(1)},${y1.toFixed(1)} ${(x2 - dx).toFixed(1)},${y2.toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)}`;
      }
      cons.push({ id: e.id, from: e.from, to: e.to, cat: e.cat, d });
    });
    const sig = cons.map((c) => c.id + c.d).join("|");
    if (sig !== sigRef.current) {
      sigRef.current = sig;
      setConnectors(cons);
    }
  }, [vertical]);

  // ── Effects ───────────────────────────────────────────────────────────────

  useEffect(() => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() =>
      requestAnimationFrame(() => measure()),
    );
  }, [expanded, filter, view, measure]);

  useEffect(() => {
    const onResize = () => {
      setVertical(window.innerWidth < 768);
      if (rtRef.current) clearTimeout(rtRef.current);
      rtRef.current = setTimeout(() => measure(), 150);
    };
    onResize();
    window.addEventListener("resize", onResize);
    if (document.fonts?.ready) document.fonts.ready.then(() => measure());
    return () => {
      window.removeEventListener("resize", onResize);
      if (rtRef.current) clearTimeout(rtRef.current);
      cancelAnimationFrame(rafRef.current);
    };
  }, [measure]);

  // Keep the panel height in sync with the stage — CSS transitions the change.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const sync = () => setPanelH(stage.offsetHeight);
    sync();

    const ro = new ResizeObserver(sync);
    ro.observe(stage);
    return () => ro.disconnect();
  }, []);

  // ── Interaction handlers ──────────────────────────────────────────────────

  function toggle(id: string) {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function setView(v: View) {
    setViewState(v);
    setExpanded(initExpanded(v));
  }

  function toggleFilter(id: string) {
    setFilter((prev) => (prev === id ? null : id));
  }

  function enter(
    id: string,
    label: string,
    desc: string,
    color: string,
    e: React.MouseEvent,
  ) {
    const stage = stageRef.current;
    if (!stage) { setHovered(id); return; }
    const cr = stage.getBoundingClientRect();
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setHovered(id);
    setTip({
      show: true, label, desc, color,
      x: r.left - cr.left + r.width / 2,
      y: r.top - cr.top - 12,
    });
  }

  function leave() {
    setHovered(null);
    setTip((prev) => ({ ...prev, show: false }));
  }

  // ── Derived values ────────────────────────────────────────────────────────

  const hset = hovered ? hoverSet(hovered) : null;

  function bright(id: string, cat: string): boolean {
    const fo = !filter || cat === filter || id === "root";
    const ho = !hset || hset.has(id);
    return fo && ho;
  }

  function glow(color: string, b: boolean): string {
    return b
      ? `0 0 0 1px ${color}66, 0 0 26px -6px ${color}`
      : `0 0 0 1px ${color}22`;
  }

  const activeEdgeSet = hset
    ? connectors.filter(
        (c) =>
          hset.has(c.from) &&
          hset.has(c.to) &&
          (!filter || c.cat === filter),
      )
    : [];

  const VIEWS: View[] = ["Catégories", "Sous-groupes", "Tout"];

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <section id="stack" className="scroll-mt-20 py-14 sm:py-20">
      <Container>
        <SectionLabel index="02" file="stack.json" />

        {/* ── Controls row ──────────────────────────────────────────────── */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">

          {/* View toggle */}
          <div
            style={{
              display: "flex", alignItems: "center", gap: 4,
              padding: 4, borderRadius: 10,
              background: "var(--surface)", border: "1px solid var(--line)",
            }}
          >
            {VIEWS.map((v) => {
              const active = view === v;
              return (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  style={{
                    border: "none", cursor: "pointer",
                    fontFamily: "var(--font-mono)", fontSize: 12,
                    padding: "7px 13px", borderRadius: 7,
                    transition: "all .22s",
                    background: active ? "var(--accent-soft)" : "transparent",
                    color: active ? "var(--fg)" : "var(--muted)",
                    boxShadow: active
                      ? "0 0 0 1px var(--accent), 0 4px 12px -6px rgba(0,0,0,0.35)"
                      : "none",
                  }}
                >
                  {v}
                </button>
              );
            })}
          </div>

          {/* Filter chips */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span
              style={{
                fontFamily: "var(--font-mono)", fontSize: 11,
                color: "var(--faint)", letterSpacing: ".1em",
              }}
            >
              FILTRE //
            </span>
            {stack.map((cat) => {
              const active = filter === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => toggleFilter(cat.id)}
                  onMouseEnter={() => setHovered(cat.id)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 7,
                    cursor: "pointer",
                    fontFamily: "var(--font-mono)", fontSize: 12,
                    padding: "6px 12px", borderRadius: 999,
                    transition: "all .22s",
                    background: active ? `${cat.color}22` : "var(--surface)",
                    border: `1px solid ${active ? cat.color + "88" : "var(--line)"}`,
                    color: active ? "var(--fg)" : "var(--muted)",
                  }}
                >
                  <span
                    style={{
                      width: 8, height: 8, borderRadius: 2,
                      background: cat.color,
                      boxShadow: `0 0 8px ${cat.color}`,
                      flexShrink: 0,
                    }}
                  />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Diagram panel ─────────────────────────────────────────────── */}
        <div
          style={{
            position: "relative", borderRadius: 16,
            border: "1px solid var(--line)",
            background: "linear-gradient(180deg, var(--surface), var(--bg))",
            boxShadow: "0 40px 90px -50px #000, inset 0 1px 0 #ffffff06",
          }}
        >
          <div
            style={{
              overflowX: "auto",
              overflowY: "hidden",
              height: panelH !== undefined ? panelH : "auto",
              transition: "height .55s cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          >
            <div
              ref={stageRef}
              style={{
                position: "relative", width: "max-content", minWidth: "100%",
                padding: vertical ? "28px 20px" : "44px 56px",
                animation: "nn-stage-in .7s ease both",
              }}
            >
            {/* SVG connector overlay */}
            <svg
              width="100%"
              height="100%"
              preserveAspectRatio="none"
              style={{
                position: "absolute", top: 0, left: 0,
                pointerEvents: "none", overflow: "visible",
              }}
            >
              {/* Static connectors — draw once, then float-pulse opacity */}
              {connectors.map((c, i) => {
                const fo = !filter || c.cat === filter;
                const delay = `${(i * 0.12) % 3}s`;
                return (
                  <path
                    key={c.id}
                    d={c.d}
                    pathLength={1}
                    fill="none"
                    stroke={colorOf[c.cat]}
                    strokeWidth={1.5}
                    strokeDasharray="1"
                    style={{
                      opacity: fo ? undefined : 0.05,
                      animation: fo
                        ? `nn-draw .9s ease both, nn-float-pulse 3s ease-in-out ${delay} infinite`
                        : "none",
                    }}
                  />
                );
              })}
              {/* Active (hovered) edges — flowing dashes like tentacles */}
              {activeEdgeSet.map((c) => (
                <path
                  key={c.id + "-a"}
                  d={c.d}
                  fill="none"
                  stroke={colorOf[c.cat]}
                  strokeWidth={2.2}
                  strokeLinecap="round"
                  opacity={0.95}
                  strokeDasharray="5 13"
                  style={{
                    animation: "nn-flow 1s linear infinite",
                    filter: `drop-shadow(0 0 5px ${colorOf[c.cat]})`,
                  }}
                />
              ))}
            </svg>

            {/* Tree layout */}
            <div
              style={{
                position: "relative", display: "flex",
                flexDirection: vertical ? "column" : "row",
                alignItems: "center", gap: vertical ? 28 : 80,
              }}
            >

              {/* Root node */}
              <FloatAnchor nodeId="root">
                <RootNode
                  totalCount={totalTechs}
                  bright={!hset || hset.has("root")}
                  onMouseEnter={(e) =>
                    enter(
                      "root",
                      "Full-Stack Architecture",
                      `${totalTechs} technologies réparties sur 5 couches, du frontend au cloud.`,
                      "#22d3ee",
                      e,
                    )
                  }
                  onMouseLeave={leave}
                />
              </FloatAnchor>

              {/* Categories column */}
              <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
                {stack.map((cat) => {
                  const cb = bright(cat.id, cat.id);
                  const cCount = cat.subgroups.reduce((n, s) => n + s.techs.length, 0);
                  return (
                    <div
                      key={cat.id}
                      style={{
                        display: "flex",
                        flexDirection: vertical ? "column" : "row",
                        alignItems: "center", gap: vertical ? 20 : 80,
                      }}
                    >

                      {/* Category node */}
                      <FloatAnchor nodeId={cat.id}>
                        <CategoryNode
                          cat={cat}
                          count={cCount}
                          bright={cb}
                          expanded={!!expanded[cat.id]}
                          glow={glow(cat.color, cb)}
                          onToggle={() => toggle(cat.id)}
                          onMouseEnter={(e) =>
                            enter(cat.id, cat.label, cat.desc, cat.color, e)
                          }
                          onMouseLeave={leave}
                        />
                      </FloatAnchor>

                      {/* Subgroups column */}
                      {expanded[cat.id] && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                          {cat.subgroups.map((sub) => {
                            const sb = bright(sub.id, cat.id);
                            return (
                              <div
                                key={sub.id}
                                style={{
                                  display: "flex",
                                  flexDirection: vertical ? "column" : "row",
                                  alignItems: "center", gap: vertical ? 16 : 64,
                                }}
                              >
                                {/* Subgroup node */}
                                <FloatAnchor nodeId={sub.id}>
                                  <SubgroupNode
                                    sub={sub}
                                    color={cat.color}
                                    bright={sb}
                                    expanded={!!expanded[sub.id]}
                                    glow={glow(cat.color, sb)}
                                    onToggle={() => toggle(sub.id)}
                                    onMouseEnter={(e) =>
                                      enter(sub.id, sub.label, sub.desc, cat.color, e)
                                    }
                                    onMouseLeave={leave}
                                  />
                                </FloatAnchor>

                                {/* Tech nodes */}
                                {expanded[sub.id] && (
                                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                    {sub.techs.map((t) => {
                                      const tb = bright(t.id, cat.id);
                                      return (
                                        <FloatAnchor key={t.id} nodeId={t.id}>
                                          <TechNode
                                            tech={t}
                                            color={cat.color}
                                            bright={tb}
                                            glow={glow(cat.color, tb)}
                                            abbr={abbr(t.label)}
                                            onMouseEnter={(e) =>
                                              enter(t.id, t.label, t.desc, cat.color, e)
                                            }
                                            onMouseLeave={leave}
                                          />
                                        </FloatAnchor>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tooltip */}
            <div
              style={{
                position: "absolute",
                left: tip.x,
                top: tip.y,
                transform: "translate(-50%, -100%)",
                pointerEvents: "none",
                opacity: tip.show ? 1 : 0,
                transition: "opacity .18s",
                zIndex: 20,
                whiteSpace: "nowrap",
              }}
            >
              <div
                style={{
                  padding: "8px 14px",
                  borderRadius: 10,
                  background: "var(--surface)",
                  border: `1px solid ${tip.color}55`,
                  boxShadow: `0 8px 28px -8px #000, 0 0 0 1px ${tip.color}22`,
                }}
              >
                <div style={{ fontWeight: 600, fontSize: 13, color: "var(--fg)" }}>
                  {tip.label}
                </div>
                {tip.desc && (
                  <div
                    style={{
                      fontFamily: "var(--font-mono)", fontSize: 11,
                      color: "var(--muted)", marginTop: 3,
                    }}
                  >
                    {tip.desc}
                  </div>
                )}
              </div>
              <div
                style={{
                  width: 8, height: 8, borderRadius: 1,
                  background: "var(--surface)",
                  border: `1px solid ${tip.color}55`,
                  transform: "rotate(45deg)",
                  margin: "-5px auto 0",
                }}
              />
            </div>
          </div>
          </div>
        </div>

        {/* Legend hint */}
        <div
          style={{
            display: "flex", alignItems: "center", gap: 8,
            marginTop: 12,
            fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--faint)",
          }}
        >
          <span
            style={{
              width: 6, height: 6, borderRadius: "50%",
              background: "#34d399", flexShrink: 0,
            }}
          />
          Survolez un nœud pour tracer son chemin · cliquez une branche pour la déployer
        </div>
      </Container>
    </section>
  );
}

// ─── FloatAnchor ─────────────────────────────────────────────────────────────
/**
 * Outer div carries data-node-id so the SVG connector measurement stays stable.
 * Inner div floats with a subtle translateY animation — CSS transforms don't
 * affect layout flow, so the anchor position never changes.
 */
function FloatAnchor({
  nodeId,
  children,
}: {
  nodeId: string;
  children: React.ReactNode;
}) {
  const dur = floatDuration(nodeId);
  const delay = floatDelay(nodeId);
  return (
    <div data-node-id={nodeId} style={{ position: "relative" }}>
      <div
        className="nn-node-float"
        style={{
          animation: `nn-node-float ${dur} ease-in-out ${delay} infinite`,
        }}
      >
        {children}
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function RootNode({
  totalCount,
  bright,
  onMouseEnter,
  onMouseLeave,
}: {
  totalCount: number;
  bright: boolean;
  onMouseEnter: (e: React.MouseEvent) => void;
  onMouseLeave: () => void;
}) {
  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        display: "flex", flexDirection: "column", gap: 6,
        padding: "18px 22px", borderRadius: 16, whiteSpace: "nowrap",
        background: "linear-gradient(150deg, var(--surface), var(--bg))",
        border: "1px solid #22d3ee44",
        boxShadow: bright
          ? "0 0 0 1px #22d3ee22, 0 0 40px -8px #22d3ee66"
          : "0 0 0 1px #22d3ee11",
        transition: "box-shadow .35s",
        cursor: "default",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-mono)", fontSize: 10,
          letterSpacing: ".24em", color: "#22d3ee",
        }}
      >
        ROOT
      </div>
      <div style={{ fontSize: 19, fontWeight: 700, letterSpacing: "-.01em", color: "var(--fg)" }}>
        Full-Stack
      </div>
      <div style={{ fontSize: 13, color: "var(--muted)" }}>
        {totalCount} technologies · 5 couches
      </div>
    </div>
  );
}

function CategoryNode({
  cat,
  count,
  bright,
  expanded,
  glow,
  onToggle,
  onMouseEnter,
  onMouseLeave,
}: {
  cat: StackCategory;
  count: number;
  bright: boolean;
  expanded: boolean;
  glow: string;
  onToggle: () => void;
  onMouseEnter: (e: React.MouseEvent) => void;
  onMouseLeave: () => void;
}) {
  return (
    <div
      onClick={onToggle}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "13px 17px", borderRadius: 14, cursor: "pointer",
        whiteSpace: "nowrap",
        background: "linear-gradient(150deg, var(--surface), var(--bg))",
        border: "1px solid var(--line)",
        opacity: bright ? 1 : 0.22,
        boxShadow: glow,
        transition: "opacity .35s, box-shadow .35s",
      }}
    >
      {/* Badge with Lucide icon */}
      <span
        style={{
          width: 36, height: 36, borderRadius: 10,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: `${cat.color}1a`, color: cat.color,
          border: `1px solid ${cat.color}55`,
          flexShrink: 0,
        }}
      >
        <Icon name={cat.icon} size={16} />
      </span>
      <span style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: "var(--fg)" }}>
          {cat.label}
        </span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--muted)" }}>
          {count} items
        </span>
      </span>
      <span
        style={{
          marginLeft: 6, width: 22, height: 22, borderRadius: 6,
          display: "grid", placeItems: "center",
          fontSize: 14, lineHeight: 1,
          background: `${cat.color}18`, color: cat.color,
        }}
      >
        {expanded ? "−" : "+"}
      </span>
    </div>
  );
}

function SubgroupNode({
  sub,
  color,
  bright,
  expanded,
  glow,
  onToggle,
  onMouseEnter,
  onMouseLeave,
}: {
  sub: { id: string; label: string; techs: { id: string }[] };
  color: string;
  bright: boolean;
  expanded: boolean;
  glow: string;
  onToggle: () => void;
  onMouseEnter: (e: React.MouseEvent) => void;
  onMouseLeave: () => void;
}) {
  return (
    <div
      onClick={onToggle}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "10px 14px", borderRadius: 12, cursor: "pointer",
        whiteSpace: "nowrap",
        background: "var(--surface)",
        border: `1px solid ${color}22`,
        opacity: bright ? 1 : 0.22,
        boxShadow: glow,
        transition: "opacity .35s, box-shadow .35s",
      }}
    >
      <span
        style={{
          width: 6, height: 6, borderRadius: "50%",
          background: color, boxShadow: `0 0 6px ${color}`,
          flexShrink: 0,
        }}
      />
      <span style={{ fontSize: 13, fontWeight: 500, color: "var(--fg)" }}>
        {sub.label}
      </span>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--muted)" }}>
        {sub.techs.length}
      </span>
      <span style={{ fontSize: 12, color, marginLeft: 2 }}>
        {expanded ? "−" : "+"}
      </span>
    </div>
  );
}

function TechNode({
  tech,
  color,
  bright,
  glow,
  abbr: abbrStr,
  onMouseEnter,
  onMouseLeave,
}: {
  tech: { id: string; label: string };
  color: string;
  bright: boolean;
  glow: string;
  abbr: string;
  onMouseEnter: (e: React.MouseEvent) => void;
  onMouseLeave: () => void;
}) {
  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        display: "flex", alignItems: "center", gap: 8,
        padding: "7px 12px", borderRadius: 10,
        whiteSpace: "nowrap",
        background: "var(--bg)",
        border: `1px solid ${color}18`,
        opacity: bright ? 1 : 0.2,
        boxShadow: glow,
        transition: "opacity .35s, box-shadow .35s",
        cursor: "default",
      }}
    >
      <span
        style={{
          width: 26, height: 26, borderRadius: 7,
          display: "grid", placeItems: "center",
          fontFamily: "var(--font-mono)", fontSize: 9, fontWeight: 700,
          background: `${color}15`, color,
          border: `1px solid ${color}30`,
          flexShrink: 0,
        }}
      >
        {abbrStr}
      </span>
      <span style={{ fontSize: 12, fontWeight: 500, color: "var(--fg)" }}>
        {tech.label}
      </span>
    </div>
  );
}
