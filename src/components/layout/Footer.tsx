import { Container } from "@/components/ui/Container";

export function Footer() {
  return (
    <footer className="border-t border-line py-8">
      <Container>
        <p className="font-mono text-xs text-faint">
          <span className="text-accent">{"// "}</span>© 2026 nomena nisiah — built
          with next.js · seo-ready · i18n [ en · de · fr ]
        </p>
      </Container>
    </footer>
  );
}
