import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Target, Award, Users, ShieldCheck } from 'lucide-react';
import { api } from '@/lib/api';
import { alternatesFor } from '@/lib/seo';
import { Breadcrumb } from '@/components/Breadcrumb';
import { CountUp } from '@/components/CountUp';

export const dynamic = 'force-dynamic';

type LocaleParams = Promise<{ locale: string }>;

export async function generateMetadata({
  params,
}: {
  params: LocaleParams;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'about' });
  return { title: t('title'), alternates: alternatesFor(locale, '/haqimizda') };
}

const TIMELINE = [
  { year: '2010', uz: 'Kompaniya tashkil etildi', ru: 'Основание компании', en: 'Company founded' },
  { year: '2014', uz: 'Birinchi yirik neft-gaz loyihasi', ru: 'Первый крупный нефтегазовый проект', en: 'First major oil & gas project' },
  { year: '2018', uz: 'Yetakchi brendlar bilan rasmiy hamkorlik', ru: 'Официальное партнёрство с ведущими брендами', en: 'Official partnerships with leading brands' },
  { year: '2022', uz: 'DCS va SCADA tizimlari boʻyicha kengayish', ru: 'Расширение по системам DCS и SCADA', en: 'Expansion into DCS and SCADA systems' },
  { year: '2026', uz: 'Oʻzbekiston boʻylab 500+ loyiha', ru: '500+ проектов по всему Узбекистану', en: '500+ projects across Uzbekistan' },
];

export default async function AboutPage({ params }: { params: LocaleParams }) {
  const { locale } = await params;
  const loc = locale === 'ru' ? 'ru' : locale === 'en' ? 'en' : 'uz';
  setRequestLocale(locale);
  const t = await getTranslations('about');
  const th = await getTranslations('home');
  const brands = await api.brands();

  const values = [
    { icon: Target, uz: 'Aniqlik va sifat', ru: 'Точность и качество', en: 'Precision and quality' },
    { icon: ShieldCheck, uz: 'Sertifikatlangan uskunalar', ru: 'Сертифицированное оборудование', en: 'Certified equipment' },
    { icon: Award, uz: '15 yillik tajriba', ru: '15 лет опыта', en: '15 years of experience' },
    { icon: Users, uz: 'Mutaxassis jamoa', ru: 'Команда специалистов', en: 'Expert team' },
  ];

  return (
    <>
      <Breadcrumb items={[{ label: 'Power Automation', href: '/' }, { label: t('title') }]} />
      <div className="container-x pb-16">
        <h1 className="text-3xl font-bold text-text-dark sm:text-4xl">{t('title')}</h1>
        <p className="mt-4 max-w-3xl text-text-mid">
          {loc === 'ru'
            ? 'Power Automation MCHJ — поставщик промышленного оборудования и измерительных систем для нефтегазовой, химической, горнодобывающей и энергетической отраслей Узбекистана.'
            : loc === 'en'
              ? 'Power Automation MCHJ supplies industrial equipment and measurement systems for the oil & gas, chemical, mining and energy sectors of Uzbekistan.'
              : 'Power Automation MCHJ — Oʻzbekistonning neft-gaz, kimyo, togʻ-kon va energetika tarmoqlari uchun sanoat uskunalari va oʻlchov tizimlarini yetkazib beruvchi kompaniya.'}
        </p>

        <section className="mt-12">
          <h2 className="h2 mb-8">{t('history')}</h2>
          <ol className="relative ml-2 border-l-2 border-blue-accent/40 pl-6">
            {TIMELINE.map((item) => (
              <li key={item.year} className="reveal relative mb-8 last:mb-0">
                <span className="absolute -left-[31px] top-1 h-4 w-4 rounded-full bg-blue-dark ring-4 ring-white" />
                <span className="font-mono text-sm font-bold text-blue-mid">{item.year}</span>
                <p className="mt-1 text-text-dark">{loc === 'ru' ? item.ru : loc === 'en' ? item.en : item.uz}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-14">
          <h2 className="h2 mb-8">{t('mission')}</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <div key={i} className="card reveal p-6">
                <div className="grid h-12 w-12 place-items-center rounded-lg bg-blue-bg text-blue-dark">
                  <v.icon className="h-6 w-6" />
                </div>
                <p className="mt-4 font-semibold text-text-dark">{loc === 'ru' ? v.ru : loc === 'en' ? v.en : v.uz}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14">
          <h2 className="h2 mb-6">{t('certificates')}</h2>
          <div className="flex flex-wrap gap-3">
            {['ATEX', 'IECEx', 'GOST', 'CE', 'ISO 9001'].map((c) => (
              <span key={c} className="inline-flex items-center gap-2 rounded-lg border border-blue-bg bg-white px-4 py-3 font-semibold text-text-dark">
                <ShieldCheck className="h-5 w-5 text-blue-mid" /> {c}
              </span>
            ))}
          </div>
        </section>

        {brands.length > 0 && (
          <section className="mt-14">
            <h2 className="h2 mb-6">{t('partners')}</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {brands.map((b) => (
                <div key={b.id} className="flex h-20 items-center justify-center rounded-xl border border-blue-bg bg-white text-lg font-bold text-text-mid">
                  {b.name}
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="mt-14 grid grid-cols-2 gap-6 rounded-2xl bg-blue-dark p-8 text-center text-white lg:grid-cols-4">
          <div><div className="text-4xl font-bold text-blue-accent"><CountUp end={15} suffix="+" /></div><div className="mt-1 text-sm text-white/80">{th('statsExperience')}</div></div>
          <div><div className="text-4xl font-bold text-blue-accent"><CountUp end={500} suffix="+" /></div><div className="mt-1 text-sm text-white/80">{th('statsProjects')}</div></div>
          <div><div className="text-4xl font-bold text-blue-accent"><CountUp end={30} suffix="+" /></div><div className="mt-1 text-sm text-white/80">{th('statsBrands')}</div></div>
          <div><div className="text-4xl font-bold text-blue-accent">🇺🇿</div><div className="mt-1 text-sm text-white/80">{th('statsCoverage')}</div></div>
        </section>
      </div>
    </>
  );
}
