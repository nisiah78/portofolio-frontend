import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { personalProjects } from "@/data/personalProjects";
import type { Locale } from "@/i18n/config";
import { Icon, Link } from "lucide-react";

export function MyProjects({ locale }: { locale: Locale }) {
  const items = personalProjects[locale];

  return (
    <section id="my-projects" className="scroll-mt-20 py-14 sm:py-20">
      <Container>
        <SectionLabel index="04" file="side-projects/" />
        <Reveal>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 items-center">
            {items.map((project) => (
              <div
                key={project.slug}
                className="overflow-hidden rounded-xl border border-line bg-surface"
              >
                <div className="relative aspect-2/1 w-full">
                  <Image
                    src={project.image}
                    alt={project.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-5 sm:p-6">
                  <div className="flex items-center gap-2">
                    <a className="flex items-center gap-2" href={project.github} target="_blank" rel="noopener noreferrer">
                    <Link size={14}/>
                    <h3 className="text-lg font-semibold text-fg">{project.name}</h3>
                      </a>
                    <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[11px] font-medium text-accent">
                      {project.status}
                    </span>
                  </div>
                  <p className="mt-2.5 text-sm leading-6 text-muted">{project.description}</p>
                  <div className="mt-3.5 flex flex-wrap gap-1.5">
                    {project.stack.map((s) => (
                      <span
                        key={s}
                        className="rounded border border-neutral-200 bg-neutral-50 px-1.5 py-0.5 font-mono text-[10.5px] text-neutral-600"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
