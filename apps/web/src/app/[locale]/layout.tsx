import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { Inter, IBM_Plex_Mono } from 'next/font/google';
import { routing } from '@/i18n/routing';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ScrollReveal } from '@/components/ScrollReveal';
import { Providers } from '@/components/providers/Providers';
import { GoogleAnalytics } from '@/components/GoogleAnalytics';
import { OrganizationJsonLd } from '@/components/OrganizationJsonLd';
import { COMPANY } from '@/lib/constants';
import { api } from '@/lib/api';
import { cookies } from 'next/headers';
import '../globals.css';

const inter = Inter({ subsets: ['latin', 'cyrillic'], variable: '--font-inter' });
const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-plex-mono',
});

export const metadata: Metadata = {
  metadataBase: new URL(COMPANY.siteUrl),
  title: {
    default: 'Power Automation — Sanoat uchun ishonchli yechimlar',
    template: '%s | Power Automation',
  },
  description:
    'Neft-gaz, kimyo va togʻ-kon sanoati uchun uskuna va oʻlchov tizimlari yetkazib beruvchi.',
  applicationName: 'Power Automation',
  keywords: [
    'KIP', 'instrumentation', 'pressure transmitter', 'flow meter', 'level sensor',
    'control valve', 'gas detector', 'Emerson', 'Yokogawa', 'Endress+Hauser', 'ABB',
    'Honeywell', 'Siemens', 'avtomatlashtirish', 'oʻlchov asboblari', 'Oʻzbekiston',
  ],
  openGraph: {
    type: 'website',
    siteName: 'Power Automation',
    locale: 'uz_UZ',
    alternateLocale: ['ru_RU', 'en_US'],
  },
  twitter: { card: 'summary_large_image', title: 'Power Automation' },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  const { locale } = params;
  if (!routing.locales.includes(locale as 'uz' | 'ru' | 'en')) notFound();
  setRequestLocale(locale);

  const messages = await getMessages();
  const [categories, featured] = await Promise.all([api.categories(), api.featured()]);
  const theme = cookies().get('theme')?.value === 'dark' ? 'dark' : '';

  return (
    <html lang={locale} className={`${inter.variable} ${plexMono.variable} ${theme}`}>
      <body className="font-sans">
        <GoogleAnalytics />
        <OrganizationJsonLd />
        <NextIntlClientProvider messages={messages}>
          <ScrollReveal />
          <Providers>
            <Header locale={locale} categories={categories} featured={featured} />
            <main className="min-h-screen pb-16 lg:pb-0">{children}</main>
            <Footer locale={locale} categories={categories} />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
