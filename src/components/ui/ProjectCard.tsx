import Image from "next/image";
import type { Project } from "@/data/projects";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group overflow-hidden rounded-[14px] border border-line bg-surface transition-[border-color,transform] duration-300 hover:-translate-y-1 hover:border-accent">
      <div className="relative h-[158px] overflow-hidden">
        <Image
          src={project.image}
          alt={project.alt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1080px) 50vw, 340px"
          className="object-cover"
        />
        {/* dark gradient overlay (theme-independent, keeps name/date readable) */}
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(8,9,11,0.1)] to-[rgba(8,9,11,0.85)]" />
        {/* project / company name — bottom-left, always white */}
        <span className="absolute bottom-3 left-4 font-mono text-[15px] text-white">
          <span className="text-accent">▸</span> {project.name}
        </span>
        {/* date pill — top-right */}
        <span className="absolute right-3 top-3 rounded-full bg-black/45 px-2.5 py-[3px] font-mono text-[11px] text-neutral-100 backdrop-blur-sm">
          {project.period}
        </span>
      </div>
      <div className="px-[22px] pb-[22px] pt-[18px]">
        <div className="mb-2.5 font-mono text-[11.5px] text-muted">{project.role}</div>
        <p className="mb-4 text-[15px] leading-[1.6] text-muted">{project.description}</p>
        <div className="flex flex-wrap gap-2 font-mono text-[11.5px] text-faint">
          {project.tags.map((tag) => (
            <span key={tag}>#{tag}</span>
          ))}
        </div>
      </div>
    </article>
  );
}
