import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Send, FileText, Download, ShieldCheck } from 'lucide-react';
import type { ProductDocument, Specification } from '@pa/types';
import { pick, telegramLink, industryLabel } from '@pa/ui';
import { api, API_URL } from '@/lib/api';
import { alternatesFor } from '@/lib/seo';
import { COMPANY } from '@/lib/constants';
import { Breadcrumb } from '@/components/Breadcrumb';
import { ProductGallery } from '@/components/ProductGallery';
import { ProductCard } from '@/components/ProductCard';
import { ProductTabs } from '@/components/ProductTabs';

export const revalidate = 600; // ISR: regenerate every 10 min

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  try {
    const product = await api.product(params.slug);
    const loc = params.locale === 'ru' ? 'ru' : params.locale === 'en' ? 'en' : 'uz';
    const name = pick(product, 'name', loc);
    const desc = pick(product, 'description', loc);
    return {
      title: name,
      description: desc.slice(0, 160),
      alternates: alternatesFor(params.locale, `/mahsulotlar/${params.slug}`),
      openGraph: { title: name, description: desc.slice(0, 160), type: 'website' },
    };
  } catch {
    return { title: 'Mahsulot' };
  }
}

export default async function ProductPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const loc = params.locale === 'ru' ? 'ru' : params.locale === 'en' ? 'en' : 'uz';
  setRequestLocale(params.locale);
  const t = await getTranslations('common');

  let product;
  try {
    product = await api.product(params.slug);
  } catch {
    notFound();
  }

  const name = pick(product, 'name', loc);
  const desc = pick(product, 'description', loc);
  const specs = (product.specifications ?? []) as Specification[];
  const docs = (product.documents ?? []) as ProductDocument[];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description: desc,
    brand: product.brand ? { '@type': 'Brand', name: product.brand.name } : undefined,
    category: pick(product.category, 'name', loc),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Breadcrumb
        items={[
          { label: 'Power Automation', href: '/' },
          { label: loc === 'ru' ? 'Продукция' : 'Mahsulotlar', href: '/mahsulotlar' },
          { label: name },
        ]}
      />

      <div className="container-x pb-16">
        <div className="grid gap-10 lg:grid-cols-2">
          <ProductGallery images={product.images ?? []} label={product.brand?.name ?? name} />

          <div>
            {product.brand?.name && (
              <span className="text-sm font-semibold uppercase tracking-wide text-blue-mid">
                {product.brand.name}
              </span>
            )}
            <h1 className="mt-1 text-2xl font-bold text-text-dark sm:text-3xl">{name}</h1>
            {product.badge && <span className="badge mt-3">{product.badge}</span>}
            <p className="mt-4 leading-relaxed text-text-mid">{desc}</p>

            {/* Certificates */}
            {product.certificates.length > 0 && (
              <div className="mt-5">
                <h2 className="mb-2 text-sm font-semibold text-text-dark">{t('certificates')}</h2>
                <div className="flex flex-wrap gap-2">
                  {product.certificates.map((c) => (
                    <span
                      key={c}
                      className="inline-flex items-center gap-1 rounded-lg bg-green-50 px-3 py-1.5 text-sm font-medium text-green-700"
                    >
                      <ShieldCheck className="h-4 w-4" /> {c}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Full-width Telegram CTA */}
            <a
              href={telegramLink(product.id)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-telegram mt-6 w-full py-4 text-base"
            >
              <Send className="h-5 w-5" />
              {t('telegramInquiry')}
            </a>
          </div>
        </div>

        {/* Tabbed details */}
        <ProductTabs
          tabs={[
            {
              key: 'overview',
              labelKey: 'overview',
              hidden: product.industries.length === 0 && !desc,
              content: (
                <div className="space-y-6">
                  <p className="max-w-3xl leading-relaxed text-text-mid">{desc}</p>
                  {product.industries.length > 0 && (
                    <div>
                      <h3 className="mb-2 text-sm font-semibold text-text-dark">{t('industries')}</h3>
                      <div className="flex flex-wrap gap-2">
                        {product.industries.map((ind) => (
                          <span key={ind} className="badge">
                            {industryLabel(ind, loc)}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ),
            },
            {
              key: 'specs',
              labelKey: 'specifications',
              hidden: specs.length === 0,
              content: (
                <div className="overflow-hidden rounded-xl border border-blue-bg bg-white">
                  <table className="w-full text-sm">
                    <tbody>
                      {specs.map((s, i) => (
                        <tr key={i} className={i % 2 ? 'bg-neutralbg' : 'bg-white'}>
                          <td className="w-1/2 px-5 py-3 font-medium text-text-mid">{s.label}</td>
                          <td className="px-5 py-3 font-mono text-text-dark">{s.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ),
            },
            {
              key: 'docs',
              labelKey: 'documents',
              content: (
                <div className="max-w-xl space-y-2">
                  {/* Auto-generated branded datasheet from this product's data */}
                  <a
                    href={`${API_URL}/api/products/${product.slug}/datasheet?lang=${loc}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-lg border border-blue-dark bg-blue-bg px-4 py-3 text-sm font-medium hover:bg-blue-dark hover:text-white"
                  >
                    <span className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      {loc === 'ru'
                        ? 'Технический лист (PDF)'
                        : loc === 'en'
                          ? 'Technical datasheet (PDF)'
                          : 'Texnik maʼlumotnoma (PDF)'}
                    </span>
                    <Download className="h-4 w-4" />
                  </a>
                  {docs.map((doc, i) => (
                    <a
                      key={i}
                      href={doc.url.startsWith('/uploads') ? `${API_URL}${doc.url}` : doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between rounded-lg border border-blue-bg bg-white px-4 py-3 text-sm hover:border-blue-mid"
                    >
                      <span className="flex items-center gap-2 text-text-dark">
                        <FileText className="h-4 w-4 text-blue-mid" /> {doc.name}
                      </span>
                      <Download className="h-4 w-4 text-text-mid" />
                    </a>
                  ))}
                </div>
              ),
            },
            {
              key: 'related',
              labelKey: 'related',
              hidden: product.related.length === 0,
              content: (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {product.related.slice(0, 4).map((p) => (
                    <ProductCard key={p.id} product={p} locale={loc} />
                  ))}
                </div>
              ),
            },
          ]}
        />

        {/* Second Telegram CTA */}
        <div className="mt-14 rounded-2xl bg-gradient-to-r from-blue-dark to-blue-mid p-8 text-center text-white">
          <p className="text-lg font-semibold">
            {loc === 'ru'
              ? 'Заинтересованы в этом продукте?'
              : loc === 'en'
                ? 'Interested in this product?'
                : 'Ushbu mahsulot bilan qiziqyapsizmi?'}
          </p>
          <a
            href={telegramLink(product.id)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-telegram mx-auto mt-4 px-6 py-3"
          >
            <Send className="h-5 w-5" />
            {t('telegramInquiry')}
          </a>
        </div>
      </div>
    </>
  );
}
