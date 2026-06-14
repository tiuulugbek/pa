import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { pick } from '@pa/ui';
import { api } from '@/lib/api';
import { alternatesFor } from '@/lib/seo';
import { Link } from '@/i18n/navigation';
import { Breadcrumb } from '@/components/Breadcrumb';
import { SmartImage } from '@/components/SmartImage';
import { Pagination } from '@/components/Pagination';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'news' });
  return {
    title: t('title'),
    description: t('subtitle'),
    alternates: alternatesFor(params.locale, '/yangiliklar'),
  };
}

export default async function NewsPage({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams: { page?: string; category?: string };
}) {
  const loc = params.locale === 'ru' ? 'ru' : params.locale === 'en' ? 'en' : 'uz';
  setRequestLocale(params.locale);
  const t = await getTranslations('news');

  const result = await api.news({
    page: searchParams.page,
    category: searchParams.category,
    limit: 9,
  });

  const categories = ['Yangilik', 'Texnik maqola', 'Loyiha'];

  return (
    <>
      <Breadcrumb items={[{ label: 'Power Automation', href: '/' }, { label: t('title') }]} />
      <div className="container-x pb-16">
        <h1 className="text-3xl font-bold text-text-dark sm:text-4xl">{t('title')}</h1>
        <p className="mt-3 text-text-mid">{t('subtitle')}</p>

        <div className="mt-6 flex flex-wrap gap-2">
          <Link
            href="/yangiliklar"
            className={`rounded-full px-4 py-1.5 text-sm ${
              !searchParams.category ? 'bg-blue-dark text-white' : 'border border-blue-bg bg-white text-text-mid'
            }`}
          >
            {loc === 'ru' ? 'Все' : 'Barchasi'}
          </Link>
          {categories.map((c) => (
            <Link
              key={c}
              href={`/yangiliklar?category=${encodeURIComponent(c)}`}
              className={`rounded-full px-4 py-1.5 text-sm ${
                searchParams.category === c
                  ? 'bg-blue-dark text-white'
                  : 'border border-blue-bg bg-white text-text-mid'
              }`}
            >
              {c}
            </Link>
          ))}
        </div>

        {result.data.length === 0 ? (
          <p className="mt-10 text-text-mid">{loc === 'ru' ? 'Ничего не найдено' : 'Hech narsa topilmadi'}</p>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {result.data.map((post) => (
              <Link
                key={post.id}
                href={`/yangiliklar/${post.slug}`}
                className="card reveal overflow-hidden"
              >
                <div className="aspect-[16/9] w-full">
                  <SmartImage src={post.thumbnail} alt={pick(post, 'title', loc)} className="h-full w-full" />
                </div>
                <div className="p-5">
                  {post.category && <span className="badge">{post.category}</span>}
                  <h2 className="mt-2 line-clamp-2 text-lg font-semibold text-text-dark">
                    {pick(post, 'title', loc)}
                  </h2>
                  {post.publishedAt && (
                    <p className="mt-2 text-xs text-text-mid">
                      {new Date(post.publishedAt).toLocaleDateString(loc === 'ru' ? 'ru-RU' : 'uz-UZ')}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        <Pagination page={result.page} totalPages={result.totalPages} />
      </div>
    </>
  );
}
