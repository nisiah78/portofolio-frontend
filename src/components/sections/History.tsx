import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { HistoryTimeline } from "@/components/ui/HistoryTimeline";
import type { Locale } from "@/i18n/config";

export function History({ locale }: { locale: Locale }) {
  return (
    <section id="history" className="scroll-mt-20 py-14 sm:py-20">
      <Container>
        <div className="mx-auto max-w-3xl">
          <SectionLabel index="04" file="history.log" />
          <HistoryTimeline locale={locale} />
        </div>
      </Container>
    </section>
  );
}
