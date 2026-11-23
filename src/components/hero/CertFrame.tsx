import { certification } from "@/data/profile";
import type { Dictionary } from "@/i18n/dictionaries";

/** The framed certificate hanging at the bottom-right of the hero (v2 design). */
export function CertFrame({ t }: { t: Dictionary["office"] }) {
  return (
    <a
      className="nn-cert"
      href={certification.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t.certAria}
    >
      <span className="nn-cert-nail" aria-hidden />
      <span className="nn-cert-frame">
        <span className="nn-cert-mat">
          <span className="nn-cert-row">
            <span className="nn-cert-seal" aria-hidden>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="9" r="6" />
                <path d="m9 9 2 2 4-4" />
                <path d="M8.5 14 7 22l5-3 5 3-1.5-8" />
              </svg>
            </span>
            <span className="nn-cert-txt">
              <span className="nn-cert-eyebrow">{t.certEyebrow}</span>
              <span className="nn-cert-title">Claude Certified Architect – Foundations</span>
            </span>
          </span>
          <span className="nn-cert-foot">
            <span>Anthropic</span>
            <b>
              {t.verify}
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              </svg>
            </b>
          </span>
        </span>
      </span>
    </a>
  );
}
