import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { MapPin } from 'lucide-react';
import { INDUSTRY_META, industryLabel, pick } from '@pa/ui';
import { api } from '@/lib/api';
import { alternatesFor } from '@/lib/seo';
import { Link } from '@/i18n/navigation';
import { Breadcrumb } from '@/components/Breadcrumb';
import { SmartImage } from '@/components/SmartImage';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'projects' });
  return {
    title: t('title'),
    description: t('subtitle'),
    alternates: alternatesFor(params.locale, '/loyihalar'),
  };
}

export default async function ProjectsPage({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams: { industry?: string };
}) {
  const loc = params.locale === 'ru' ? 'ru' : params.locale === 'en' ? 'en' : 'uz';
  setRequestLocale(params.locale);
  const t = await getTranslations('projects');
  const projects = await api.projects({ industry: searchParams.industry });

  return (
    <>
      <Breadcrumb items={[{ label: 'Power Automation', href: '/' }, { label: t('title') }]} />
      <div className="container-x pb-16">
        <h1 className="text-3xl font-bold text-text-dark sm:text-4xl">{t('title')}</h1>
        <p className="mt-3 text-text-mid">{t('subtitle')}</p>

        {/* Industry filter */}
        <div className="mt-6 flex flex-wrap gap-2">
          <Link
            href="/loyihalar"
            className={`rounded-full px-4 py-1.5 text-sm ${
              !searchParams.industry ? 'bg-blue-dark text-white' : 'bg-white text-text-mid border border-blue-bg'
            }`}
          >
            {loc === 'ru' ? 'Все' : 'Barchasi'}
          </Link>
          {INDUSTRY_META.slice(0, 4).map((ind) => (
            <Link
              key={ind.key}
              href={`/loyihalar?industry=${ind.key}`}
              className={`rounded-full px-4 py-1.5 text-sm ${
                searchParams.industry === ind.key
                  ? 'bg-blue-dark text-white'
                  : 'bg-white text-text-mid border border-blue-bg'
              }`}
            >
              {loc === 'ru' ? ind.ru : loc === 'en' ? ind.en : ind.uz}
            </Link>
          ))}
        </div>

        {projects.length === 0 ? (
          <p className="mt-10 text-text-mid">{loc === 'ru' ? 'Ничего не найдено' : 'Hech narsa topilmadi'}</p>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {projects.map((proj) => (
              <Link
                key={proj.id}
                href={`/loyihalar/${proj.slug}`}
                className="card reveal overflow-hidden"
              >
                <div className="aspect-[16/9] w-full">
                  <SmartImage
                    src={proj.images?.[0]}
                    alt={pick(proj, 'title', loc)}
                    className="h-full w-full"
                  />
                </div>
                <div className="p-5">
                  <span className="badge">{industryLabel(proj.industry, loc)}</span>
                  <h2 className="mt-2 text-lg font-semibold text-text-dark">
                    {pick(proj, 'title', loc)}
                  </h2>
                  <p className="mt-1 flex items-center gap-1 text-sm text-text-mid">
                    <MapPin className="h-4 w-4" /> {proj.location} · {proj.year}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
