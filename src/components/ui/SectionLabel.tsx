import { Reveal } from "./Reveal";

/** The "// 01  about.md" file-style label above each section. */
export function SectionLabel({ index, file }: { index: string; file: string }) {
  return (
    <Reveal className="mb-8 font-mono text-xs">
      <span className="text-accent">{"//"} {index}</span>
      <span className="ml-3 text-muted">{file}</span>
    </Reveal>
  );
}
