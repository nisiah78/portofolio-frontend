import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { PodiumAnimation } from "@/components/ui/PodiumAnimation";
import { profile } from "@/data/profile";
import type { Dictionary } from "@/i18n/dictionaries";

export function Contact({ dict }: { dict: Dictionary }) {
  return (
    <section id="contact" className="scroll-mt-20 border-t border-line py-16 sm:py-24">
      <Container>
        <SectionLabel index="06" file="contact" />
        <Reveal>
          <div className="flex flex-col gap-10 text-center lg:flex-row lg:items-start lg:gap-12 lg:text-left">
            {/* Left — 2/3: copy + contact pills */}
            <div className="min-w-0 lg:w-2/3">
              <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-5 lg:justify-start">
                <h2 className="text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
                  {dict.contact.title}
                </h2>
                <PodiumAnimation />
              </div>

              <p className="mx-auto mt-4 max-w-[520px] text-[17px] leading-relaxed text-muted lg:mx-0">
                {dict.contact.lead}
              </p>

              <div className="mt-7 flex flex-wrap justify-center gap-3.5 font-mono text-[13px] lg:justify-start">
                <a
                  href={profile.phoneHref}
                  className="rounded-full border border-line px-4 py-2 text-fg transition-colors hover:border-accent hover:text-accent"
                >
                  {profile.phone}
                </a>
                <a
                  href={profile.socials.linkedin}
                  target="_blank"
                  rel="noopener"
                  className="rounded-full border border-line px-4 py-2 text-fg transition-colors hover:border-accent hover:text-accent"
                >
                  {profile.socials.linkedinLabel}
                </a>
                <span className="rounded-full border border-line px-4 py-2 text-muted">
                  {profile.location}
                </span>
              </div>
            </div>

            {/* Right — 1/3: mailto only */}
            <div className="min-w-0 lg:w-1/3">
              <div className="rounded-[14px] border border-line bg-surface px-6 py-5">
                <div className="mb-2.5 font-mono text-[12.5px] text-faint">
                  $ mail --to
                </div>
                <a
                  href={`mailto:${profile.email}`}
                  className="inline-flex max-w-full items-baseline break-all font-mono text-xl font-medium text-accent transition-opacity hover:opacity-70 sm:text-[26px]"
                >
                  {profile.email}
                  <span
                    aria-hidden
                    className="ml-1.5 inline-block h-[1em] w-[11px] shrink-0 animate-[nn-blink_1.1s_step-end_infinite] bg-accent"
                    style={{ verticalAlign: "-2px" }}
                  />
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
