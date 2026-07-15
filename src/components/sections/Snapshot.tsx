import { Container } from "@/components/ui/Container";
import { CodeCard } from "@/components/ui/CodeCard";
import { Reveal } from "@/components/ui/Reveal";
import type { Dictionary } from "@/i18n/dictionaries";

export function Snapshot({ dict }: { dict: Dictionary }) {
  return (
    <section id="snapshot" className="scroll-mt-20 py-14 sm:py-20">
      <Container>
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <Reveal className="flex flex-col gap-4 text-center lg:text-left">
            <div className="font-mono text-sm text-muted">
              <span className="text-accent">$</span> whoami
            </div>
            <p className="text-lg leading-8 text-muted">{dict.hero.lead}</p>
          </Reveal>
          <Reveal>
            <CodeCard />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
