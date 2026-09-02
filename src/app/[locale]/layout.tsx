import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { CodeMist } from "@/components/ui/CodeMist";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { Footer } from "@/components/layout/Footer";
import { getDictionary } from "@/i18n/dictionaries";
import { locales, isLocale, type Locale } from "@/i18n/config";
import "../globals.css";

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
});

const sans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex-sans",
  display: "swap",
});

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "Nomena Nisiah — Senior Php / Symfony / Typescript Developer",
    description:
      "Nomena Nisiah — Senior Php / Symfony / Typescript Developer. 9 years across PHP/Symfony backends and React/Next.js frontends. Available for select roles.",
    alternates: {
      canonical: `/${locale}`,
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}`])),
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale as Locale);

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${mono.variable} ${sans.variable}`}
    >
      <body>
        <ThemeProvider>
          <CodeMist />
          <SiteChrome dict={dict} locale={locale as Locale} />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
