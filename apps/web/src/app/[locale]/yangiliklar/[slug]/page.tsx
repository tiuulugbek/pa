import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { pick } from '@pa/ui';
import { api } from '@/lib/api';
import { alternatesFor } from '@/lib/seo';
import { Link } from '@/i18n/navigation';
import { Breadcrumb } from '@/components/Breadcrumb';
import { SmartImage } from '@/components/SmartImage';

export const revalidate = 600; // ISR: regenerate every 10 min

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  try {
    const post = await api.newsPost(params.slug);
    const loc = params.locale === 'ru' ? 'ru' : params.locale === 'en' ? 'en' : 'uz';
    return {
      title: pick(post, 'title', loc),
      description: pick(post, 'body', loc).slice(0, 160),
      alternates: alternatesFor(params.locale, `/yangiliklar/${params.slug}`),
    };
  } catch {
    return { title: 'Yangilik' };
  }
}

export default async function NewsPostPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const loc = params.locale === 'ru' ? 'ru' : params.locale === 'en' ? 'en' : 'uz';
  setRequestLocale(params.locale);
  const t = await getTranslations('news');

  let post;
  try {
    post = await api.newsPost(params.slug);
  } catch {
    notFound();
  }

  const title = pick(post, 'title', loc);
  const body = pick(post, 'body', loc);

  return (
    <>
      <Breadcrumb
        items={[
          { label: 'Power Automation', href: '/' },
          { label: t('title'), href: '/yangiliklar' },
          { label: title },
        ]}
      />
      <article className="container-x pb-16">
        <div className="mx-auto max-w-3xl">
          {post.category && <span className="badge">{post.category}</span>}
          <h1 className="mt-2 text-3xl font-bold text-text-dark sm:text-4xl">{title}</h1>
          {post.publishedAt && (
            <p className="mt-2 text-sm text-text-mid">
              {new Date(post.publishedAt).toLocaleDateString(loc === 'ru' ? 'ru-RU' : 'uz-UZ', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          )}
          {post.thumbnail && (
            <div className="mt-6 aspect-[16/9] w-full overflow-hidden rounded-xl">
              <SmartImage src={post.thumbnail} alt={title} className="h-full w-full" />
            </div>
          )}
          <div className="prose mt-8 max-w-none whitespace-pre-line leading-relaxed text-text-mid">
            {body}
          </div>
        </div>

        {post.related.length > 0 && (
          <div className="mx-auto mt-14 max-w-3xl">
            <h2 className="mb-5 text-xl font-semibold text-text-dark">{t('related')}</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              {post.related.map((r) => (
                <Link
                  key={r.id}
                  href={`/yangiliklar/${r.slug}`}
                  className="card p-5"
                >
                  {r.category && <span className="badge">{r.category}</span>}
                  <h3 className="mt-2 line-clamp-2 font-semibold text-text-dark">
                    {pick(r, 'title', loc)}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </>
  );
}
