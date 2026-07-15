import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ServicesCarousel } from "@/components/ui/ServicesCarousel";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";

export function Services({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  return (
    <section id="services" className="scroll-mt-20 py-14 sm:py-20">
      <Container>
        <SectionLabel index="05" file="services.ts" />
        <Reveal>
          <ServicesCarousel titles={dict.services} locale={locale} />
        </Reveal>
        <p className="mt-4 font-mono text-xs text-faint">
          auto-playing — hover or tap a panel to explore
        </p>
      </Container>
    </section>
  );
}
