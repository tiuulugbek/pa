'use client';

import { useCallback, useState, type ReactNode } from 'react';
import { useRouter, usePathname } from '@/i18n/navigation';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import type { Brand, Category } from '@pa/types';
import { INDUSTRY_META, CERTIFICATES_LIST, pick } from '@/lib/filters-data';

export function CatalogFilters({
  categories,
  brands,
  locale,
  children,
}: {
  categories: Category[];
  brands: Brand[];
  locale: 'uz' | 'ru' | 'en';
  children: ReactNode;
}) {
  const t = useTranslations('products');
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [open, setOpen] = useState(false);
  const [searchText, setSearchText] = useState(params.get('search') ?? '');

  const setParam = useCallback(
    (key: string, value?: string | null) => {
      const next = new URLSearchParams(params.toString());
      if (value === null || value === undefined || value === '') next.delete(key);
      else next.set(key, value);
      if (key !== 'page') next.delete('page');
      router.push(`${pathname}?${next.toString()}`);
    },
    [params, pathname, router],
  );

  const activeCategory = params.get('category');
  const activeBrand = params.get('brand');
  const activeIndustry = params.get('industry');
  const activeCert = params.get('certificate');

  const Panel = (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="mb-2 text-sm font-semibold text-text-dark">{t('categories')}</h3>
        <ul className="space-y-1 text-sm">
          {categories.map((cat) => (
            <li key={cat.id}>
              <button
                onClick={() => setParam('category', String(cat.id))}
                className={`block w-full text-left ${
                  activeCategory === String(cat.id) ? 'font-semibold text-blue-dark' : 'text-text-mid'
                } hover:text-blue-dark`}
              >
                {pick(cat, 'name', locale)}
              </button>
              {(cat.children ?? []).length > 0 && (
                <ul className="ml-3 mt-1 space-y-1 border-l border-blue-bg pl-3">
                  {cat.children!.map((c) => (
                    <li key={c.id}>
                      <button
                        onClick={() => setParam('category', String(c.id))}
                        className={`text-left text-xs ${
                          activeCategory === String(c.id) ? 'font-semibold text-blue-dark' : 'text-text-mid'
                        } hover:text-blue-mid`}
                      >
                        {pick(c, 'name', locale)}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Brands */}
      <div>
        <h3 className="mb-2 text-sm font-semibold text-text-dark">{t('brands')}</h3>
        <ul className="space-y-1 text-sm">
          {brands.map((b) => (
            <li key={b.id}>
              <label className="flex cursor-pointer items-center gap-2 text-text-mid">
                <input
                  type="checkbox"
                  checked={activeBrand === String(b.id)}
                  onChange={(e) => setParam('brand', e.target.checked ? String(b.id) : null)}
                />
                {b.name}
              </label>
            </li>
          ))}
        </ul>
      </div>

      {/* Industries */}
      <div>
        <h3 className="mb-2 text-sm font-semibold text-text-dark">{t('industryFilter')}</h3>
        <ul className="space-y-1 text-sm">
          {INDUSTRY_META.slice(0, 4).map((ind) => (
            <li key={ind.key}>
              <label className="flex cursor-pointer items-center gap-2 text-text-mid">
                <input
                  type="checkbox"
                  checked={activeIndustry === ind.key}
                  onChange={(e) => setParam('industry', e.target.checked ? ind.key : null)}
                />
                {locale === 'ru' ? ind.ru : locale === 'en' ? ind.en : ind.uz}
              </label>
            </li>
          ))}
        </ul>
      </div>

      {/* Certificates */}
      <div>
        <h3 className="mb-2 text-sm font-semibold text-text-dark">{t('certificateFilter')}</h3>
        <ul className="space-y-1 text-sm">
          {CERTIFICATES_LIST.slice(0, 3).map((cert) => (
            <li key={cert}>
              <label className="flex cursor-pointer items-center gap-2 text-text-mid">
                <input
                  type="checkbox"
                  checked={activeCert === cert}
                  onChange={(e) => setParam('certificate', e.target.checked ? cert : null)}
                />
                {cert}
              </label>
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={() => {
          setSearchText('');
          router.push(pathname);
        }}
        className="text-sm font-medium text-blue-mid hover:underline"
      >
        {t('clearFilters')}
      </button>
    </div>
  );

  return (
    <div>
      {/* Search + sort bar */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <form
          className="relative flex-1"
          onSubmit={(e) => {
            e.preventDefault();
            setParam('search', searchText || null);
          }}
        >
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-mid" />
          <input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder={t('search') ?? 'Search...'}
            className="w-full rounded-lg border border-blue-bg bg-white py-2.5 pl-10 pr-3 text-sm outline-none focus:border-blue-mid"
          />
        </form>
        <select
          value={params.get('sort') ?? 'new'}
          onChange={(e) => setParam('sort', e.target.value)}
          className="rounded-lg border border-blue-bg bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-mid"
        >
          <option value="new">{t('sortNew')}</option>
          <option value="alpha">{t('sortAlpha')}</option>
          <option value="popular">{t('sortPopular')}</option>
        </select>
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center justify-center gap-2 rounded-lg border border-blue-bg bg-white px-3 py-2.5 text-sm lg:hidden"
        >
          <SlidersHorizontal className="h-4 w-4" /> {t('filters')}
        </button>
      </div>

      {/* Layout: sidebar + content */}
      <div className="flex flex-col gap-8 lg:flex-row">
        <aside className="hidden w-[260px] shrink-0 lg:block">
          <div className="sticky top-20 rounded-xl border border-blue-bg bg-white p-5">{Panel}</div>
        </aside>
        <div className="flex-1">{children}</div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-4/5 max-w-xs overflow-y-auto bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-semibold">{t('filters')}</span>
              <button onClick={() => setOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            {Panel}
          </div>
        </div>
      )}
    </div>
  );
}
