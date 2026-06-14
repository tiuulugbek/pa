import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Send, CheckCircle2 } from 'lucide-react';
import { industryBySlug, telegramLink, pick } from '@pa/ui';
import { api } from '@/lib/api';
import { alternatesFor } from '@/lib/seo';
import { Link } from '@/i18n/navigation';
import { Breadcrumb } from '@/components/Breadcrumb';
import { IndustryIcon } from '@/components/IndustryIcon';
import { ProductCard } from '@/components/ProductCard';
import { ProcessDiagram } from '@/components/ProcessDiagram';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const ind = industryBySlug(params.slug);
  if (!ind) return { title: 'Soha' };
  const loc = params.locale === 'ru' ? 'ru' : params.locale === 'en' ? 'en' : 'uz';
  return {
    title: loc === 'ru' ? ind.ru : loc === 'en' ? ind.en : ind.uz,
    description: loc === 'ru' ? ind.descRu : loc === 'en' ? ind.descEn : ind.descUz,
    alternates: alternatesFor(params.locale, `/sohalar/${params.slug}`),
  };
}

const PROBLEMS: Record<string, { uz: string; ru: string }[]> = {
  oil_gas: [
    { uz: 'Portlash xavfi mavjud zonalarda ishlash (ATEX/IECEx)', ru: 'Работа во взрывоопасных зонах (ATEX/IECEx)' },
    { uz: 'Yuqori bosim va haroratda aniq oʻlchov', ru: 'Точные измерения при высоком давлении и температуре' },
    { uz: 'Uzluksiz texnologik jarayonlarni boshqarish', ru: 'Управление непрерывными технологическими процессами' },
  ],
  chemical: [
    { uz: 'Agressiv muhitlarga chidamli materiallar', ru: 'Материалы, стойкие к агрессивным средам' },
    { uz: 'pH va kimyoviy tarkibni nazorat qilish', ru: 'Контроль pH и химического состава' },
  ],
  mining: [
    { uz: 'Chang va vibratsiyaga chidamli uskunalar', ru: 'Оборудование, устойчивое к пыли и вибрации' },
    { uz: 'Yirik dvigatellarni boshqarish', ru: 'Управление крупными двигателями' },
  ],
  energy: [
    { uz: 'Issiqlik va elektr stansiyalarini monitoring', ru: 'Мониторинг тепло- и электростанций' },
    { uz: 'Yuqori ishonchlilik va ortiqchalik', ru: 'Высокая надёжность и резервирование' },
  ],
  food: [
    { uz: 'Gigiyenik standartlarga muvofiqlik', ru: 'Соответствие гигиеническим стандартам' },
    { uz: 'CIP/SIP jarayonlariga moslik', ru: 'Совместимость с процессами CIP/SIP' },
  ],
  water: [
    { uz: 'Suv sifatini real vaqtda nazorat qilish', ru: 'Контроль качества воды в реальном времени' },
    { uz: 'Nasos stansiyalarini avtomatlashtirish', ru: 'Автоматизация насосных станций' },
  ],
};

export default async function IndustryPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const ind = industryBySlug(params.slug);
  if (!ind) notFound();
  const loc = params.locale === 'ru' ? 'ru' : params.locale === 'en' ? 'en' : 'uz';
  setRequestLocale(params.locale);
  const t = await getTranslations('industries');

  const [productsRes, projects] = await Promise.all([
    api.products({ industry: ind.key, limit: 8 }),
    api.projects({ industry: ind.key }),
  ]);

  const problems = PROBLEMS[ind.key] ?? [];

  return (
    <>
      <Breadcrumb
        items={[
          { label: 'Power Automation', href: '/' },
          { label: t('title'), href: '/sohalar' },
          { label: loc === 'ru' ? ind.ru : loc === 'en' ? ind.en : ind.uz },
        ]}
      />

      {/* Hero banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-dark to-blue-mid py-16 text-white">
        <div className="container-x flex items-center gap-5">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-white/15">
            <IndustryIcon name={ind.icon} className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold sm:text-4xl">{loc === 'ru' ? ind.ru : loc === 'en' ? ind.en : ind.uz}</h1>
            <p className="mt-2 max-w-2xl text-white/85">{loc === 'ru' ? ind.descRu : loc === 'en' ? ind.descEn : ind.descUz}</p>
          </div>
        </div>
      </section>

      <div className="container-x py-14">
        {/* Instrumentation process diagram */}
        <div className="mb-14">
          <h2 className="h2 mb-6">
            {loc === 'ru' ? 'Где применяются приборы' : loc === 'en' ? 'Where instruments are used' : 'Asboblar qayerda qoʻllaniladi'}
          </h2>
          <ProcessDiagram locale={loc} />
        </div>

        {/* Problems & solutions */}
        {problems.length > 0 && (
          <div className="mb-14">
            <h2 className="h2 mb-6">{t('problemsSolutions')}</h2>
            <ul className="grid gap-4 sm:grid-cols-2">
              {problems.map((p, i) => (
                <li key={i} className="card flex items-start gap-3 p-5">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-blue-mid" />
                  <span className="text-text-mid">{loc === 'ru' ? p.ru : p.uz}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Products */}
        {productsRes.data.length > 0 && (
          <div className="mb-14">
            <h2 className="h2 mb-6">{t('productsForIndustry')}</h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {productsRes.data.map((p) => (
                <ProductCard key={p.id} product={p} locale={loc} />
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <div>
            <h2 className="h2 mb-6">{t('projectsForIndustry')}</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {projects.map((proj) => (
                <Link
                  key={proj.id}
                  href={`/loyihalar/${proj.slug}`}
                  className="card p-6"
                >
                  <span className="badge">{proj.year}</span>
                  <h3 className="mt-2 text-lg font-semibold text-text-dark">
                    {pick(proj, 'title', loc)}
                  </h3>
                  <p className="mt-1 text-sm text-text-mid">{proj.location}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mt-14 text-center">
          <a href={telegramLink()} target="_blank" rel="noopener noreferrer" className="btn-telegram mx-auto px-6 py-3">
            <Send className="h-5 w-5" />
            {loc === 'ru' ? 'Связаться через Telegram' : 'Telegram orqali murojaat'}
          </a>
        </div>
      </div>
    </>
  );
}
