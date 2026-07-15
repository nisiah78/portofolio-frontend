"use client";

import { useEffect, useState } from "react";
import { Container } from "@/components/ui/Container";
import { ParallaxCardCarousel } from "@/components/ui/3d-cards-slider";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { projects } from "@/data/projects";
import type { Locale } from "@/i18n/config";

/** Matches Tailwind's sm/lg/xl breakpoints. */
function maxVisible(width: number): number {
  if (width >= 1280) return 5; // xl — large screens
  if (width >= 1024) return 4; // lg
  if (width >= 640) return 2; // sm/md — tablet
  return 1; // phone
}

export function Work({ locale }: { locale: Locale }) {
  // Defaults to the largest tier so the first client render matches the SSR output;
  // the effect corrects it to the real viewport right after mount.
  const [visible, setVisible] = useState(5);

  useEffect(() => {
    const onResize = () => setVisible(maxVisible(window.innerWidth));
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const cards = projects[locale].map((project) => ({
    id: project.slug,
    title: project.name,
    subtitle: `${project.role} · ${project.period}`,
    description: project.description,
    imageUrl: project.image,
    actionLabel: project.tags.slice(0, 2).map((t) => `#${t}`).join(" "),
  }));

  return (
    <section id="work" className="scroll-mt-20 py-14 sm:py-20">
      <Container>
        <SectionLabel index="03" file="projects/" />
        <Reveal>
          <ParallaxCardCarousel
            cards={cards}
            visibleCount={visible}
            autoplaySpeed={4000}
            perspective={1500}
            backgroundColor="bg-transparent"
          />
        </Reveal>
      </Container>
    </section>
  );
}
