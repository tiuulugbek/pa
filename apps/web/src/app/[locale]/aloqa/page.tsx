import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { telegramLink } from '@pa/ui';
import { Breadcrumb } from '@/components/Breadcrumb';
import { ContactForm } from '@/components/ContactForm';
import { MapEmbed } from '@/components/MapEmbed';
import { COMPANY } from '@/lib/constants';
import { alternatesFor } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'contact' });
  return {
    title: t('title'),
    description: t('subtitle'),
    alternates: alternatesFor(locale, '/aloqa'),
  };
}

const FAQ = [
  {
    uz: 'Mahsulotlarni qanday buyurtma qilaman?',
    ru: 'Как заказать продукцию?',
    en: 'How do I order products?',
    auz: 'Mahsulot sahifasidagi "Telegram orqali soʻrov" tugmasi orqali murojaat qiling — mutaxassislarimiz bogʻlanadi.',
    aru: 'Нажмите «Запрос через Telegram» на странице товара — наши специалисты свяжутся с вами.',
    aen: 'Use the "Inquire via Telegram" button on any product page — our specialists will contact you.',
  },
  {
    uz: 'Uskunalar sertifikatlanganmi?',
    ru: 'Сертифицировано ли оборудование?',
    en: 'Is the equipment certified?',
    auz: 'Ha, mahsulotlarimiz ATEX, IECEx, GOST va boshqa xalqaro sertifikatlarga ega.',
    aru: 'Да, наша продукция имеет сертификаты ATEX, IECEx, ГОСТ и другие международные.',
    aen: 'Yes, our products carry ATEX, IECEx, GOST and other international certifications.',
  },
  {
    uz: 'Yetkazib berish Oʻzbekiston boʻylab amalga oshiriladimi?',
    ru: 'Осуществляется ли доставка по всему Узбекистану?',
    en: 'Do you deliver across Uzbekistan?',
    auz: 'Ha, biz Oʻzbekistonning barcha hududlariga yetkazib beramiz va texnik yordam koʻrsatamiz.',
    aru: 'Да, мы доставляем во все регионы Узбекистана и оказываем техническую поддержку.',
    aen: 'Yes, we deliver to all regions of Uzbekistan and provide technical support.',
  },
];

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const loc = locale === 'ru' ? 'ru' : locale === 'en' ? 'en' : 'uz';
  setRequestLocale(locale);
  const t = await getTranslations('contact');
  const address = loc === 'ru' ? COMPANY.addressRu : COMPANY.addressUz;

  return (
    <>
      <Breadcrumb items={[{ label: 'Power Automation', href: '/' }, { label: t('title') }]} />
      <div className="container-x pb-16">
        <h1 className="text-3xl font-bold text-text-dark sm:text-4xl">{t('title')}</h1>
        <p className="mt-3 text-text-mid">{t('subtitle')}</p>

        <div className="mt-10 grid gap-10 lg:grid-cols-2">
          <div className="space-y-6">
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-blue-bg text-blue-dark">
                  <MapPin className="h-5 w-5" />
                </span>
                <div>
                  <div className="text-sm font-semibold text-text-dark">{t('address')}</div>
                  <div className="text-sm text-text-mid">{address}</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-blue-bg text-blue-dark">
                  <Phone className="h-5 w-5" />
                </span>
                <div>
                  <div className="text-sm font-semibold text-text-dark">{t('phone')}</div>
                  <a href={`tel:${COMPANY.phoneHref}`} className="text-sm text-text-mid hover:text-blue-dark">
                    {COMPANY.phone}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-blue-bg text-blue-dark">
                  <Mail className="h-5 w-5" />
                </span>
                <div>
                  <div className="text-sm font-semibold text-text-dark">{t('email')}</div>
                  <a href={`mailto:${COMPANY.email}`} className="text-sm text-text-mid hover:text-blue-dark">
                    {COMPANY.email}
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-blue-bg text-blue-dark">
                  <Clock className="h-5 w-5" />
                </span>
                <div>
                  <div className="text-sm font-semibold text-text-dark">{t('workHours')}</div>
                  <div className="text-sm text-text-mid">{t('workHoursValue')}</div>
                </div>
              </li>
            </ul>

            <a href={telegramLink()} target="_blank" rel="noopener noreferrer" className="btn-telegram px-6 py-3">
              <Send className="h-5 w-5" /> {COMPANY.telegram}
            </a>

            <MapEmbed />
          </div>

          <div className="rounded-2xl border border-blue-bg bg-white p-6 sm:p-8">
            <ContactForm locale={loc} />
          </div>
        </div>

        <section className="mt-16">
          <h2 className="h2 mb-6">
            {loc === 'ru' ? 'Частые вопросы' : loc === 'en' ? 'Frequently asked questions' : 'Koʻp soʻraladigan savollar'}
          </h2>
          <div className="space-y-3">
            {FAQ.map((f, i) => (
              <details key={i} className="group rounded-xl border border-blue-bg bg-white p-4">
                <summary className="cursor-pointer list-none font-semibold text-text-dark">
                  {loc === 'ru' ? f.ru : loc === 'en' ? f.en : f.uz}
                </summary>
                <p className="mt-2 text-sm text-text-mid">
                  {loc === 'ru' ? f.aru : loc === 'en' ? f.aen : f.auz}
                </p>
              </details>
            ))}
          </div>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'FAQPage',
                mainEntity: FAQ.map((f) => ({
                  '@type': 'Question',
                  name: loc === 'ru' ? f.ru : loc === 'en' ? f.en : f.uz,
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: loc === 'ru' ? f.aru : loc === 'en' ? f.aen : f.auz,
                  },
                })),
              }),
            }}
          />
        </section>
      </div>
    </>
  );
}
