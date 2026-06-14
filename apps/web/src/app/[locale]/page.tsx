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

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  return { alternates: alternatesFor(params.locale, '/') };
}

export default async function HomePage({ params }: { params: { locale: string } }) {
  const loc = params.locale === 'ru' ? 'ru' : params.locale === 'en' ? 'en' : 'uz';
  setRequestLocale(params.locale);
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
      {/* 1. Hero */}
      <section className="relative flex min-h-[88vh] items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#062c6b] via-[#0A4DB8] to-[#1A7FE8]" />
        <div className="hero-grid absolute inset-0" />
        <div className="hero-orb absolute -left-20 top-10 h-72 w-72 rounded-full" />
        <div className="hero-orb absolute -right-10 bottom-0 h-80 w-80 rounded-full" style={{ animationDelay: '3s' }} />
        <div className="absolute inset-0 bg-black/45" />
        <div className="container-x relative z-10 py-24 text-white">
          <h1 className="max-w-3xl animate-fade-in-up text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            {t('heroTitle')}
          </h1>
          <p className="mt-5 max-w-2xl animate-fade-in-up text-lg text-white/85">
            {t('heroSubtitle')}
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/mahsulotlar" className="btn-primary bg-white text-blue-dark hover:bg-white/90">
              {t('heroCatalog')}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={telegramLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
            >
              <Send className="h-4 w-4" />
              {t('heroTelegram')}
            </a>
          </div>
        </div>
      </section>

      {/* 2. Trust stats */}
      <section className="bg-blue-dark py-12 text-white">
        <div className="container-x grid grid-cols-2 gap-8 text-center lg:grid-cols-4">
          {stats.map((s, i) => (
            <div key={i} className="reveal">
              <div className="text-4xl font-bold text-blue-accent sm:text-5xl">
                {s.text ? '🇺🇿' : <CountUp end={s.value} suffix={s.suffix} />}
              </div>
              <div className="mt-2 text-sm text-white/80">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Industries */}
      <section className="section">
        <div className="container-x">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="h2 reveal">{t('industriesTitle')}</h2>
            <p className="reveal mt-3 text-text-mid">{t('industriesSubtitle')}</p>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {INDUSTRY_META.map((ind) => (
              <Link
                key={ind.key}
                href={`/sohalar/${ind.slug}`}
                className="card reveal group relative overflow-hidden p-6"
              >
                <div className="grid h-12 w-12 place-items-center rounded-lg bg-blue-bg text-blue-dark transition-colors group-hover:bg-blue-dark group-hover:text-white">
                  <IndustryIcon name={ind.icon} className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-text-dark">
                  {loc === 'ru' ? ind.ru : loc === 'en' ? ind.en : ind.uz}
                </h3>
                <p className="mt-2 text-sm text-text-mid">
                  {loc === 'ru' ? ind.descRu : loc === 'en' ? ind.descEn : ind.descUz}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Featured products */}
      {featured.length > 0 && (
        <section className="section bg-white">
          <div className="container-x">
            <h2 className="h2 reveal text-center">{t('featuredTitle')}</h2>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((p) => (
                <ProductCard key={p.id} product={p} locale={loc} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. Process */}
      <section className="section">
        <div className="container-x">
          <h2 className="h2 reveal text-center">{t('processTitle')}</h2>
          <div className="relative mt-12 grid gap-8 md:grid-cols-4">
            <div className="absolute left-0 right-0 top-7 hidden border-t-2 border-dashed border-blue-accent/40 md:block" />
            {processSteps.map((step, i) => (
              <div key={i} className="reveal relative z-10 text-center">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-blue-dark text-white">
                  <step.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-semibold text-text-dark">{step.title}</h3>
                <p className="mt-1 text-sm text-text-mid">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Brands carousel */}
      <section className="bg-white py-12">
        <div className="container-x">
          <h2 className="mb-6 text-center text-sm font-semibold uppercase tracking-widest text-text-mid">
            {t('brandsTitle')}
          </h2>
          <BrandsCarousel brands={brands} />
        </div>
      </section>

      {/* 7. Latest news */}
      {latestNews.length > 0 && (
        <section className="section">
          <div className="container-x">
            <h2 className="h2 reveal text-center">{t('newsTitle')}</h2>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {latestNews.map((post) => (
                <Link
                  key={post.id}
                  href={`/yangiliklar/${post.slug}`}
                  className="card reveal overflow-hidden"
                >
                  <div className="aspect-[16/9] w-full">
                    <SmartImage src={post.thumbnail} alt={pick(post, 'title', loc)} className="h-full w-full" />
                  </div>
                  <div className="p-4">
                    {post.category && <span className="badge">{post.category}</span>}
                    <h3 className="mt-2 line-clamp-2 font-semibold text-text-dark">
                      {pick(post, 'title', loc)}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 8. Footer CTA */}
      <section className="bg-gradient-to-r from-blue-dark to-blue-mid py-16 text-center text-white">
        <div className="container-x">
          <h2 className="text-3xl font-bold">{t('ctaTitle')}</h2>
          <p className="mt-3 text-white/85">{t('ctaSubtitle')}</p>
          <a
            href={telegramLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-telegram mx-auto mt-7 px-6 py-3"
          >
            <Send className="h-5 w-5" />
            {t('ctaButton')}
          </a>
        </div>
      </section>
    </>
  );
}
