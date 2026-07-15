import { profile } from "@/data/profile";
import { Icon } from "./Icon";

const linkClass =
  "flex size-10 items-center justify-center rounded-[11px] border border-line text-muted transition-all duration-200 hover:-translate-y-0.5 hover:border-accent hover:bg-accent-soft hover:text-accent";

export function SocialLinks() {
  return (
    <div className="flex gap-2.5">
      <a href={profile.socials.github} target="_blank" rel="noopener" title="GitHub" className={linkClass}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.2.8-.5v-2c-3.2.7-3.9-1.4-3.9-1.4-.5-1.3-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.4 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 4.6 18.3 5 18.3 5c.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.3c0 .3.2.6.8.5 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5Z" />
        </svg>
      </a>
      <a href={profile.socials.linkedin} target="_blank" rel="noopener" title="LinkedIn" className={linkClass}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M20.5 2h-17A1.5 1.5 0 0 0 2 3.5v17A1.5 1.5 0 0 0 3.5 22h17a1.5 1.5 0 0 0 1.5-1.5v-17A1.5 1.5 0 0 0 20.5 2ZM8 19H5V8h3v11ZM6.5 6.7a1.8 1.8 0 1 1 0-3.6 1.8 1.8 0 0 1 0 3.6ZM19 19h-3v-5.6c0-1.3 0-3-1.9-3s-2.1 1.4-2.1 2.9V19h-3V8h2.9v1.5h.04c.4-.8 1.4-1.6 2.9-1.6 3.1 0 3.7 2 3.7 4.7V19Z" />
        </svg>
      </a>
      <a href={`mailto:${profile.email}`} title="Email" className={linkClass}>
        <Icon name="mail" size={18} />
      </a>
    </div>
  );
}
