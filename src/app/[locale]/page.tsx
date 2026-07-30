import { notFound } from "next/navigation";
import { getDictionary } from "@/i18n/dictionaries";
import { isLocale, type Locale } from "@/i18n/config";
import { Hero } from "@/components/sections/Hero";
import { Snapshot } from "@/components/sections/Snapshot";
import { About } from "@/components/sections/About";
import { Stack } from "@/components/sections/Stack";
import { Work } from "@/components/sections/Work";
import { History } from "@/components/sections/History";
import { Services } from "@/components/sections/Services";
import { Contact } from "@/components/sections/Contact";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale as Locale);

  return (
    <main>
      <Hero dict={dict} locale={locale as Locale} />
      <Snapshot dict={dict} />
      <About dict={dict} />
      <Stack />
      <Work locale={locale as Locale} />
      <History locale={locale as Locale} />
      <Services dict={dict} locale={locale as Locale} />
      <Contact dict={dict} />
    </main>
  );
}
