import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { pick } from '@pa/ui';
import { api } from '@/lib/api';
import { alternatesFor } from '@/lib/seo';
import { COMPANY } from '@/lib/constants';
import { Breadcrumb } from '@/components/Breadcrumb';
import { CatalogFilters } from '@/components/CatalogFilters';
import { ProductCard } from '@/components/ProductCard';
import { Pagination } from '@/components/Pagination';
import { EmptyState } from '@/components/EmptyState';

export const dynamic = 'force-dynamic';

type CatalogPageParams = Promise<{ locale: string }>;

export async function generateMetadata({
  params,
}: {
  params: CatalogPageParams;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'products' });
  return {
    title: t('title'),
    description: t('title'),
    alternates: alternatesFor(locale, '/mahsulotlar'),
  };
}

interface SearchParams {
  category?: string;
  brand?: string;
  industry?: string;
  certificate?: string;
  search?: string;
  sort?: string;
  page?: string;
}

export default async function CatalogPage({
  params,
  searchParams,
}: {
  params: CatalogPageParams;
  searchParams: Promise<SearchParams>;
}) {
  const [{ locale }, query] = await Promise.all([params, searchParams]);
  const loc = locale === 'ru' ? 'ru' : locale === 'en' ? 'en' : 'uz';
  setRequestLocale(locale);
  const t = await getTranslations('products');

  const [categories, brands, result] = await Promise.all([
    api.categories(),
    api.brands(),
    api.products({
      categoryId: query.category,
      brandId: query.brand,
      industry: query.industry,
      certificate: query.certificate,
      search: query.search,
      sort: query.sort,
      page: query.page,
      limit: 20,
    }),
  ]);

  const localePrefix = locale === 'uz' ? '' : `/${locale}`;
  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: result.data.map((p, i) => ({
      '@type': 'ListItem',
      position: (result.page - 1) * result.limit + i + 1,
      url: `${COMPANY.siteUrl}${localePrefix}/mahsulotlar/${p.slug}`,
      name: pick(p, 'name', loc),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <Breadcrumb items={[{ label: 'Power Automation', href: '/' }, { label: t('title') }]} />
      <div className="container-x pb-16">
        <h1 className="mb-6 text-3xl font-bold text-text-dark">{t('title')}</h1>

        <CatalogFilters categories={categories} brands={brands} locale={loc}>
          <p className="mb-4 text-sm text-text-mid">
            {result.total} {t('resultsCount')}
          </p>

          {result.data.length === 0 ? (
            <EmptyState
              title={loc === 'ru' ? 'Ничего не найдено' : loc === 'en' ? 'Nothing found' : 'Hech narsa topilmadi'}
              hint={
                loc === 'ru'
                  ? 'Попробуйте изменить фильтры или поисковый запрос.'
                  : loc === 'en'
                    ? 'Try adjusting the filters or your search query.'
                    : 'Filtrlar yoki qidiruv soʻrovini oʻzgartirib koʻring.'
              }
            />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {result.data.map((p) => (
                <ProductCard key={p.id} product={p} locale={loc} />
              ))}
            </div>
          )}

          <Pagination page={result.page} totalPages={result.totalPages} />
        </CatalogFilters>
      </div>
    </>
  );
}
