import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { getCvDownloadName, getCvHref } from "@/data/cv";
import { profile } from "@/data/profile";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";

export function Hero({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  return (
    <section
      id="top"
      className="relative isolate overflow-hidden scroll-mt-20 py-16 sm:py-24"
    >
      {/* the hero owns its background: a gradient that dissolves into the page */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{ background: "linear-gradient(180deg, var(--hero-top) 0%, var(--bg) 100%)" }}
      />
      {/* a living aurora, concentrated here and faded out before the bottom edge */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        style={{
          maskImage: "linear-gradient(to bottom, #000 58%, transparent)",
          WebkitMaskImage: "linear-gradient(to bottom, #000 58%, transparent)",
        }}
      >
        <div className="nn-aurora nn-aurora-1" />
        <div className="nn-aurora nn-aurora-2" />
        <div className="nn-aurora nn-aurora-3" />
      </div>

      <Container>
        <div className="flex flex-wrap items-center gap-x-14 gap-y-12">
          <Reveal
            id="hero-portrait"
            className="relative mx-auto size-[300px] shrink-0 animate-[nn-float_6s_ease-in-out_infinite]"
          >
            {/* rotating accent ring */}
            <div
              className="nn-octagon absolute inset-[-11px] animate-[nn-spin_9s_linear_infinite] opacity-60"
              style={{
                background:
                  "conic-gradient(from 0deg, var(--accent), transparent 35%, var(--accent) 70%, transparent 100%)",
              }}
            />
            {/* bg gap between ring and image */}
            <div className="nn-octagon absolute inset-0 bg-bg" />
            {/* portrait */}
            <div className="nn-octagon absolute inset-[7px] overflow-hidden">
              <Image
                src="/images/profile.png"
                alt="Portrait of Nomena Nisiah"
                fill
                priority
                sizes="300px"
                className="object-cover"
              />
            </div>
            {/* floating pill chips */}
            <span className="absolute -right-4 top-0 flex items-center gap-1.5 rounded-full border border-line bg-surface px-2.5 py-1.5 font-mono text-[11.5px] text-fg shadow-[0_12px_30px_-12px_rgba(0,0,0,0.5)] animate-[nn-float_4.6s_ease-in-out_0.4s_infinite]">
              <Icon name="braces" size={14} className="text-accent" />
              TypeScript
            </span>
            <span className="absolute -left-5 bottom-1 flex items-center gap-1.5 rounded-full border border-line bg-surface px-2.5 py-1.5 font-mono text-[11.5px] text-fg shadow-[0_12px_30px_-12px_rgba(0,0,0,0.5)] animate-[nn-float_5.4s_ease-in-out_0.9s_infinite]">
              <Icon name="server" size={14} className="text-accent" />
              Symfony
            </span>
          </Reveal>

          <div className="flex min-w-[280px] flex-[1_1_340px] flex-col gap-5">
            <Reveal className="font-mono text-sm text-muted">
              <span className="text-accent">{"// "}</span>
              {dict.hero.eyebrow}
            </Reveal>
            <Reveal>
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">{profile.name}</h1>
            </Reveal>
            <Reveal className="max-w-xl text-lg text-muted">{dict.hero.tagline}</Reveal>

            <Reveal className="flex flex-wrap gap-x-5 gap-y-2 font-mono text-sm text-muted">
              <span className="flex items-center gap-1.5">
                <Icon name="map-pin" size={15} className="text-accent" />
                {profile.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Icon name="history" size={15} className="text-accent" />
                {profile.experienceYears} yrs
              </span>
              <span className="flex items-center gap-1.5">
                <Icon name="globe" size={15} className="text-accent" />
                remote
              </span>
            </Reveal>

            <Reveal className="flex flex-wrap gap-3">
              <Link
                href="#work"
                className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 font-mono text-sm font-medium text-bg transition-transform hover:-translate-y-0.5"
              >
                <Icon name="arrow-right" size={16} />
                {dict.cta.work}
              </Link>
              <a
                href={getCvHref(locale)}
                download={getCvDownloadName(locale)}
                className="flex items-center gap-2 rounded-lg border border-line px-4 py-2.5 font-mono text-sm font-medium text-fg transition-colors hover:border-accent hover:text-accent"
              >
                <Icon name="download" size={16} />
                {dict.cta.cv}
              </a>
            </Reveal>

            <Reveal>
              <SocialLinks />
            </Reveal>
          </div>
        </div>

        <Reveal className="mt-9">
          <span className="inline-flex items-center gap-2.5 rounded-full border border-line bg-surface px-4 py-2 font-mono text-[12.5px] text-muted">
            <span className="size-2 shrink-0 animate-[nn-pulse_2s_ease-in-out_infinite] rounded-full bg-syn-str" />
            {dict.meta.available}
          </span>
        </Reveal>
      </Container>
    </section>
  );
}
