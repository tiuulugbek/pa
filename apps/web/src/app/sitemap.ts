import type { MetadataRoute } from 'next';
import { api } from '@/lib/api';
import { COMPANY } from '@/lib/constants';

// Regenerate the sitemap once a day.
export const revalidate = 86400;

const LOCALES = ['uz', 'ru', 'en'] as const;
const STATIC_PATHS = [
  '/',
  '/mahsulotlar',
  '/sohalar',
  '/loyihalar',
  '/yangiliklar',
  '/haqimizda',
  '/aloqa',
];

function prefix(locale: string): string {
  return locale === 'uz' ? '' : `/${locale}`;
}

/** Emit one entry per locale with hreflang alternates. */
function entry(path: string, lastModified?: Date): MetadataRoute.Sitemap {
  const clean = path === '/' ? '' : path;
  const languages: Record<string, string> = {};
  for (const l of LOCALES) {
    languages[l === 'uz' ? 'uz-UZ' : l === 'ru' ? 'ru-RU' : 'en-US'] =
      `${COMPANY.siteUrl}${prefix(l)}${clean}`;
  }
  return LOCALES.map((l) => ({
    url: `${COMPANY.siteUrl}${prefix(l)}${clean}`,
    lastModified: lastModified ?? new Date(),
    changeFrequency: 'weekly' as const,
    priority: path === '/' ? 1 : 0.7,
    alternates: { languages },
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const urls: MetadataRoute.Sitemap = STATIC_PATHS.flatMap((p) => entry(p));

  try {
    const [products, news, projects] = await Promise.all([
      api.products({ limit: 500 }),
      api.news({ limit: 200 }),
      api.projects(),
    ]);
    for (const p of products.data) urls.push(...entry(`/mahsulotlar/${p.slug}`, new Date(p.updatedAt)));
    for (const n of news.data) urls.push(...entry(`/yangiliklar/${n.slug}`));
    for (const pr of projects) urls.push(...entry(`/loyihalar/${pr.slug}`));
  } catch {
    // API unavailable (e.g. at build time) — return static routes only.
  }

  return urls;
}
