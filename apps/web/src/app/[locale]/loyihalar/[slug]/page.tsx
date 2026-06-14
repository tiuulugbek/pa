import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { MapPin, Calendar, Send } from 'lucide-react';
import { industryLabel, telegramLink, pick } from '@pa/ui';
import { api } from '@/lib/api';
import { alternatesFor } from '@/lib/seo';
import { Breadcrumb } from '@/components/Breadcrumb';
import { SmartImage } from '@/components/SmartImage';

export const revalidate = 600; // ISR: regenerate every 10 min

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  try {
    const proj = await api.project(params.slug);
    const loc = params.locale === 'ru' ? 'ru' : params.locale === 'en' ? 'en' : 'uz';
    return {
      title: pick(proj, 'title', loc),
      description: pick(proj, 'desc', loc).slice(0, 160),
      alternates: alternatesFor(params.locale, `/loyihalar/${params.slug}`),
    };
  } catch {
    return { title: 'Loyiha' };
  }
}

export default async function ProjectPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const loc = params.locale === 'ru' ? 'ru' : params.locale === 'en' ? 'en' : 'uz';
  setRequestLocale(params.locale);
  const t = await getTranslations('projects');

  let proj;
  try {
    proj = await api.project(params.slug);
  } catch {
    notFound();
  }

  const title = pick(proj, 'title', loc);
  const desc = pick(proj, 'desc', loc);

  return (
    <>
      <Breadcrumb
        items={[
          { label: 'Power Automation', href: '/' },
          { label: t('title'), href: '/loyihalar' },
          { label: title },
        ]}
      />
      <div className="container-x pb-16">
        <span className="badge">{industryLabel(proj.industry, loc)}</span>
        <h1 className="mt-2 text-3xl font-bold text-text-dark sm:text-4xl">{title}</h1>
        <div className="mt-3 flex flex-wrap gap-5 text-sm text-text-mid">
          {proj.location && (
            <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {proj.location}</span>
          )}
          {proj.year && (
            <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {proj.year}</span>
          )}
        </div>

        {proj.images.length > 0 && (
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {proj.images.map((img, i) => (
              <div key={i} className="aspect-[16/10] overflow-hidden rounded-xl border border-blue-bg">
                <SmartImage src={img} alt={`${title} ${i + 1}`} className="h-full w-full" />
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 max-w-3xl whitespace-pre-line leading-relaxed text-text-mid">{desc}</div>

        <div className="mt-12">
          <a href={telegramLink()} target="_blank" rel="noopener noreferrer" className="btn-telegram px-6 py-3">
            <Send className="h-5 w-5" />
            {loc === 'ru' ? 'Обсудить проект в Telegram' : 'Loyihani Telegram orqali muhokama qilish'}
          </a>
        </div>
      </div>
    </>
  );
}
