"use client";

import { useEffect, useState } from "react";
import { SearchModal } from "@/components/ui/SearchModal";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { Header } from "./Header";
import { LanguageSwitcher } from "./LanguageSwitcher";

/**
 * Owns the search-modal state and renders it and the language switcher as true
 * siblings of <header> — nesting them inside it would make its conditional
 * backdrop-blur a containing block for their fixed positioning.
 */
export function SiteChrome({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const [searchOpen, setSearchOpen] = useState(false);

  // Ctrl/Cmd+K opens the stack-search modal from anywhere on the page.
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <Header dict={dict} onSearchClick={() => setSearchOpen(true)} />
      <LanguageSwitcher locale={locale} />
      <SearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        locale={locale}
        dict={dict}
      />
    </>
  );
}
