import { codeCard } from "@/data/profile";

function CodeLine({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <span className="w-4 shrink-0 select-none text-right text-faint">{n}</span>
      <span className="whitespace-pre-wrap break-words">{children}</span>
    </div>
  );
}

/** The syntax-highlighted "developer.ts" card in the snapshot section. */
export function CodeCard() {
  const last = codeCard.entries.length + 2;
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-surface font-mono text-[12.5px]">
      <div className="flex items-center gap-2 border-b border-line px-4 py-2.5 text-muted">
        <span className="size-2.5 rounded-sm bg-accent" />
        {codeCard.file}
        <span className="ml-auto text-faint">TypeScript</span>
      </div>
      <div className="overflow-x-auto p-4 leading-6">
        <CodeLine n={1}>
          <span className="text-accent">const</span> developer{" "}
          <span className="text-faint">= {"{"}</span>
        </CodeLine>
        {codeCard.entries.map((entry, i) => (
          <CodeLine key={entry.key} n={i + 2}>
            {"  "}
            {entry.key}
            <span className="text-faint">:</span>{" "}
            <span className={entry.num ? "text-syn-num" : "text-syn-str"}>{entry.value}</span>
            <span className="text-faint">,</span>
            {i === codeCard.entries.length - 1 && (
              <span
                className="ml-1.5 inline-block h-4 w-2 animate-[nn-blink_1.1s_step-end_infinite] bg-accent"
                style={{ verticalAlign: "-3px" }}
              />
            )}
          </CodeLine>
        ))}
        <CodeLine n={last}>
          <span className="text-faint">{"}"}</span>
        </CodeLine>
      </div>
    </div>
  );
}
