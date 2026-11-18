import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { certification, educationByLocale, languagesByLocale } from "@/data/profile";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

function Meta({
  label,
  value,
  href,
  className = "",
}: {
  label: string;
  value: string;
  href?: string;
  className?: string;
}) {
  return (
    <div className={`rounded-lg border border-line bg-surface p-4 ${className}`}>
      <div className="font-mono text-xs text-faint">{label}</div>
      <div className="mt-1 text-sm text-fg">
        {href ? (
          <a href={href} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:underline">
            {value} ↗
          </a>
        ) : (
          value
        )}
      </div>
    </div>
  );
}

export function About({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  return (
    <section id="about" className="scroll-mt-20 py-14 sm:py-20">
      <Container>
        <SectionLabel index="01" file="about.md" />
        <div className="grid gap-8 text-center lg:grid-cols-[1fr_1.4fr] lg:gap-16 lg:text-left">
          <Reveal>
            <h2 className="text-2xl font-semibold leading-snug sm:text-3xl">
              {dict.about.statement}
            </h2>
          </Reveal>
          <Reveal className="flex flex-col gap-6">
            <p className="leading-7 text-muted">{dict.about.body}</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <Meta label="languages" value={languagesByLocale[locale]} />
              <Meta label="education" value={educationByLocale[locale]} />
              <Meta
                label="certification"
                value={certification.label}
                href={certification.href}
                className="sm:col-span-2"
              />
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
