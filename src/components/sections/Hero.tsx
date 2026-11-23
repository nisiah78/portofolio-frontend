import Image from "next/image";
import Link from "next/link";
import { CertFrame } from "@/components/hero/CertFrame";
import { OfficeSceneLazy } from "@/components/hero/OfficeSceneLazy";
import { TourHud } from "@/components/hero/TourHud";
import { Container } from "@/components/ui/Container";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { getCvDownloadName, getCvHref } from "@/data/cv";
import { profile } from "@/data/profile";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";

const chip =
  "flex items-center gap-1.5 rounded-full border border-line bg-surface px-2.5 py-1.5 font-mono text-[11.5px] text-fg shadow-[0_12px_30px_-12px_rgba(0,0,0,0.5)]";

/** Stack chips orbiting the portrait, evenly spaced from the top, clockwise. */
const ORBIT: { label: string; icon: IconName }[] = [
  { label: "TypeScript", icon: "braces" },
  { label: "Php", icon: "server" },
  { label: "Java", icon: "coffee" },
  { label: "Python", icon: "code-2" },
  { label: "Claude", icon: "sparkles" },
];

export function Hero({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  return (
    <section
      id="top"
      // pulled up under the sticky header so the 3D office runs edge to edge
      className="relative isolate -mt-[45px] flex min-h-[100svh] scroll-mt-20 flex-col overflow-hidden"
    >
      {/* fallback backdrop — what shows if WebGL is unavailable */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{ background: "linear-gradient(180deg, var(--hero-top) 0%, var(--bg) 100%)" }}
      />
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

      <OfficeSceneLazy />
      <div aria-hidden className="nn-scrim" />

      <div className="relative z-[2] flex-1 pb-12 pt-[calc(45px+40px)] sm:pb-14 sm:pt-[calc(45px+48px)]">
        <Container>
          <div className="nn-hero-copy flex max-w-[660px] flex-col gap-[22px]">
            <Reveal
              id="hero-portrait"
              className="relative mb-8 ml-16 mt-6 size-[220px] shrink-0 animate-[nn-float_6s_ease-in-out_infinite]"
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
                  sizes="220px"
                  className="object-cover"
                />
              </div>
              {/* the whole stack orbits the portrait; each chip counter-rotates to stay upright */}
              <div className="pointer-events-none absolute -inset-[34px] animate-[nn-spin_24s_linear_infinite] rounded-full border border-dashed border-line/60 motion-reduce:animate-none">
                {ORBIT.map((item, i) => {
                  const a = -Math.PI / 2 + (i / ORBIT.length) * Math.PI * 2;
                  return (
                    <span
                      key={item.label}
                      className="absolute -translate-x-1/2 -translate-y-1/2"
                      style={{
                        left: `${(50 + 50 * Math.cos(a)).toFixed(3)}%`,
                        top: `${(50 + 50 * Math.sin(a)).toFixed(3)}%`,
                      }}
                    >
                      <span className={`${chip} animate-[nn-spin_24s_linear_infinite_reverse] motion-reduce:animate-none`}>
                        <Icon name={item.icon} size={14} className="text-accent" />
                        {item.label}
                      </span>
                    </span>
                  );
                })}
              </div>
            </Reveal>

            <Reveal className="font-mono text-[15px] leading-normal text-muted">
              <span className="text-accent">{"// "}</span>
              {dict.hero.eyebrow}
            </Reveal>
            <Reveal>
              <h1 className="text-[clamp(46px,7vw,84px)] font-bold leading-none tracking-[-0.03em]">
                {profile.name}
              </h1>
            </Reveal>
            <Reveal className="max-w-[600px] text-[17px] leading-relaxed text-muted sm:text-xl">
              {dict.hero.tagline}
            </Reveal>

            <Reveal className="flex flex-wrap gap-x-6 gap-y-2.5 font-mono text-[14.5px] text-muted">
              <span className="flex items-center gap-2">
                <Icon name="map-pin" size={17} className="text-accent" />
                {profile.location}
              </span>
              <span className="flex items-center gap-2">
                <Icon name="history" size={17} className="text-accent" />
                {profile.experienceYears} yrs
              </span>
              <span className="flex items-center gap-2">
                <Icon name="globe" size={17} className="text-accent" />
                remote
              </span>
            </Reveal>

            <Reveal className="flex flex-wrap items-center gap-3">
              <Link
                href="#work"
                className="flex min-h-11 items-center gap-2.5 rounded-[10px] bg-accent px-5 font-mono text-[15px] font-semibold text-[#1b0f05] transition-transform hover:-translate-y-0.5"
              >
                <Icon name="arrow-right" size={18} />
                {dict.cta.work}
              </Link>
              <a
                href={getCvHref(locale)}
                download={getCvDownloadName(locale)}
                className="nn-glass flex min-h-11 items-center gap-2.5 rounded-[10px] px-5 font-mono text-[15px] font-medium text-fg transition-colors hover:border-accent hover:text-accent"
              >
                <Icon name="download" size={18} />
                {dict.cta.cv}
              </a>
            </Reveal>

            <Reveal className="flex flex-wrap items-center gap-x-5 gap-y-3">
              <SocialLinks />
              <span className="nn-glass inline-flex items-center gap-2.5 rounded-full px-[18px] py-[11px] font-mono text-[13.5px] text-muted">
                <span className="size-2 shrink-0 animate-[nn-pulse_2s_ease-in-out_infinite] rounded-full bg-[#3ddc84] shadow-[0_0_0_4px_rgba(61,220,132,0.2)]" />
                {dict.meta.available}
              </span>
            </Reveal>
          </div>

          <CertFrame t={dict.office} />
        </Container>
      </div>

      <TourHud />
    </section>
  );
}
