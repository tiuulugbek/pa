import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Send, ArrowRight, FileSearch, Truck, Headphones, ClipboardList } from 'lucide-react';
import { INDUSTRY_META, telegramLink, pick } from '@pa/ui';
import { Link } from '@/i18n/navigation';
import { api } from '@/lib/api';
import { alternatesFor } from '@/lib/seo';
import { CountUp } from '@/components/CountUp';
import { ProductCard } from '@/components/ProductCard';
import { BrandsCarousel } from '@/components/BrandsCarousel';
import { IndustryIcon } from '@/components/IndustryIcon';
import { SmartImage } from '@/components/SmartImage';

export const dynamic = 'force-dynamic';

type LocaleParams = Promise<{ locale: string }>;

export async function generateMetadata({ params }: { params: LocaleParams }): Promise<Metadata> {
  const { locale } = await params;
  return { alternates: alternatesFor(locale, '/') };
}

export default async function HomePage({ params }: { params: LocaleParams }) {
  const { locale } = await params;
  const loc = locale === 'ru' ? 'ru' : locale === 'en' ? 'en' : 'uz';
  setRequestLocale(locale);
  const t = await getTranslations('home');

  const [featured, brands, latestNews] = await Promise.all([
    api.featured(),
    api.brands(),
    api.latestNews(),
  ]);

  const processSteps = [
    { icon: ClipboardList, title: t('process1'), desc: t('process1d') },
    { icon: FileSearch, title: t('process2'), desc: t('process2d') },
    { icon: Truck, title: t('process3'), desc: t('process3d') },
    { icon: Headphones, title: t('process4'), desc: t('process4d') },
  ];

  const stats = [
    { value: 15, suffix: '+', label: t('statsExperience') },
    { value: 500, suffix: '+', label: t('statsProjects') },
    { value: 30, suffix: '+', label: t('statsBrands') },
    { value: 0, suffix: '', label: t('statsCoverage'), text: true },
  ];

  return (
    <>
      <section className="relative flex min-h-[88vh] items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#062c6b] via-[#0A4DB8] to-[#1A7FE8]" />
        <div className="hero-grid absolute inset-0" />
        <div className="hero-orb absolute -left-20 top-10 h-72 w-72 rounded-full" />
        <div className="hero-orb absolute -right-10 bottom-0 h-80 w-80 rounded-full" style={{ animationDelay: '3s' }} />
        <div className="absolute inset-0 bg-black/45" />
        <div className="container-x relative z-10 py-24 text-white">
          <h1 className="max-w-3xl animate-fade-in-up text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">{t('heroTitle')}</h1>
          <p className="mt-5 max-w-2xl animate-fade-in-up text-lg text-white/85">{t('heroSubtitle')}</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/mahsulotlar" className="btn-primary bg-white text-blue-dark hover:bg-white/90">
              {t('heroCatalog')}<ArrowRight className="h-4 w-4" />
            </Link>
            <a href={telegramLink()} target="_blank" rel="noopener noreferrer" className="btn-outline">
              <Send className="h-4 w-4" />{t('heroTelegram')}
            </a>
          </div>
        </div>
      </section>

      <section className="bg-blue-dark py-12 text-white">
        <div className="container-x grid grid-cols-2 gap-6 text-center lg:grid-cols-4">
          {stats.map((s, i) => (
            <div key={i}>
              <div className="text-3xl font-bold text-blue-accent sm:text-4xl">{s.text ? '🇺🇿' : <CountUp end={s.value} suffix={s.suffix} />}</div>
              <div className="mt-1 text-sm text-white/75">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="container-x py-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div><h2 className="h2">{t('featuredTitle')}</h2><p className="mt-2 text-text-mid">{t('featuredSubtitle')}</p></div>
          <Link href="/mahsulotlar" className="hidden items-center gap-1 text-sm font-semibold text-blue-dark sm:flex">{t('viewAll')}<ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((product) => <ProductCard key={product.id} product={product} locale={loc} />)}
        </div>
      </section>

      <section className="bg-surface-muted py-16">
        <div className="container-x">
          <div className="mb-8"><h2 className="h2">{t('industriesTitle')}</h2><p className="mt-2 text-text-mid">{t('industriesSubtitle')}</p></div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Object.entries(INDUSTRY_META).map(([key, meta]) => (
              <Link key={key} href={`/mahsulotlar?industry=${key}`} className="card group p-5">
                <IndustryIcon name={meta.icon} className="h-9 w-9 text-blue-mid" />
                <h3 className="mt-4 font-semibold text-text-dark group-hover:text-blue-dark">{pick(meta, loc)}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container-x py-16">
        <div className="mb-8"><h2 className="h2">{t('brandsTitle')}</h2></div>
        <BrandsCarousel brands={brands} />
      </section>

      <section className="bg-blue-dark py-16 text-white">
        <div className="container-x">
          <div className="mb-10 text-center"><h2 className="text-3xl font-bold">{t('processTitle')}</h2></div>
          <div className="grid gap-6 md:grid-cols-4">
            {processSteps.map((step, i) => (
              <div key={i} className="text-center">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-white/10"><step.icon className="h-6 w-6 text-blue-accent" /></div>
                <h3 className="mt-4 font-semibold">{step.title}</h3><p className="mt-2 text-sm text-white/70">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {latestNews.length > 0 && (
        <section className="container-x py-16">
          <div className="mb-8 flex items-end justify-between"><h2 className="h2">{t('newsTitle')}</h2><Link href="/yangiliklar" className="text-sm font-semibold text-blue-dark">{t('viewAll')}</Link></div>
          <div className="grid gap-6 md:grid-cols-3">
            {latestNews.map((item) => (
              <Link key={item.id} href={`/yangiliklar/${item.slug}`} className="card overflow-hidden">
                {item.coverUrl && <SmartImage src={item.coverUrl} alt={pick(item, loc, 'title')} width={640} height={360} className="aspect-video w-full object-cover" />}
                <div className="p-5"><h3 className="font-semibold text-text-dark">{pick(item, loc, 'title')}</h3></div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
