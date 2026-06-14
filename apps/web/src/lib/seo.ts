import type { Metadata } from 'next';
import { COMPANY } from './constants';

const LOCALES = ['uz', 'ru', 'en'] as const;
type Loc = (typeof LOCALES)[number];

/** Path prefix for a locale (default uz has no prefix — `localePrefix: as-needed`). */
function prefix(locale: Loc): string {
  return locale === 'uz' ? '' : `/${locale}`;
}

/**
 * Builds canonical + hreflang alternates for a given route path.
 * `path` is the locale-agnostic path, e.g. '/mahsulotlar/abc' or '/'.
 */
export function alternatesFor(locale: string, path: string): Metadata['alternates'] {
  const clean = path === '/' ? '' : path;
  const current = (LOCALES.includes(locale as Loc) ? (locale as Loc) : 'uz');

  const languages: Record<string, string> = {};
  for (const l of LOCALES) {
    languages[l === 'uz' ? 'uz-UZ' : l === 'ru' ? 'ru-RU' : 'en-US'] =
      `${COMPANY.siteUrl}${prefix(l)}${clean}`;
  }
  languages['x-default'] = `${COMPANY.siteUrl}${clean}`;

  return {
    canonical: `${COMPANY.siteUrl}${prefix(current)}${clean}`,
    languages,
  };
}

/** Convenience for OG locale alternates. */
export const OG_LOCALES = ['uz_UZ', 'ru_RU', 'en_US'];
