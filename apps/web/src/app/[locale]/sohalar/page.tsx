import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ArrowRight } from 'lucide-react';
import { INDUSTRY_META } from '@pa/ui';
import { Link } from '@/i18n/navigation';
import { alternatesFor } from '@/lib/seo';
import { Breadcrumb } from '@/components/Breadcrumb';
import { IndustryIcon } from '@/components/IndustryIcon';

type IndustriesPageParams = Promise<{ locale: string }>;

export async function generateMetadata({ params }: { params: IndustriesPageParams }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'industries' });
  return {
    title: t('title'),
    description: t('subtitle'),
    alternates: alternatesFor(locale, '/sohalar'),
  };
}

export default async function IndustriesPage({ params }: { params: IndustriesPageParams }) {
  const { locale } = await params;
  const loc = locale === 'ru' ? 'ru' : locale === 'en' ? 'en' : 'uz';
  setRequestLocale(locale);
  const t = await getTranslations('industries');

  return (
    <>
      <Breadcrumb items={[{ label: 'Power Automation', href: '/' }, { label: t('title') }]} />
      <div className="container-x pb-16">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-bold text-text-dark sm:text-4xl">{t('title')}</h1>
          <p className="mt-3 text-text-mid">{t('subtitle')}</p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {INDUSTRY_META.map((ind) => (
            <Link key={ind.key} href={`/sohalar/${ind.slug}`} className="card reveal group p-7">
              <div className="grid h-14 w-14 place-items-center rounded-xl bg-blue-bg text-blue-dark transition-colors group-hover:bg-blue-dark group-hover:text-white">
                <IndustryIcon name={ind.icon} className="h-7 w-7" />
              </div>
              <h2 className="mt-5 text-xl font-semibold text-text-dark">
                {loc === 'ru' ? ind.ru : loc === 'en' ? ind.en : ind.uz}
              </h2>
              <p className="mt-2 text-sm text-text-mid">
                {loc === 'ru' ? ind.descRu : loc === 'en' ? ind.descEn : ind.descUz}
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-blue-mid">
                {loc === 'ru' ? 'Смотреть' : 'Koʻrish'} <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
