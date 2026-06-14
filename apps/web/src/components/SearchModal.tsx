'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Search, X, Loader2, PackageSearch } from 'lucide-react';
import type { Paginated, Product } from '@pa/types';
import { pick } from '@pa/ui';
import { Link } from '@/i18n/navigation';
import { API_URL } from '@/lib/api';

export function SearchModal() {
  const t = useTranslations('search');
  const params = useParams();
  const loc = params.locale === 'ru' ? 'ru' : params.locale === 'en' ? 'en' : 'uz';
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Global Cmd/Ctrl+K shortcut + custom open event (dispatched by header triggers).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    const onOpen = () => setOpen(true);
    window.addEventListener('keydown', onKey);
    window.addEventListener('pa:search-open', onOpen);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('pa:search-open', onOpen);
    };
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  // Debounced instant search.
  const runSearch = useCallback(async (term: string) => {
    if (!term.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/products?search=${encodeURIComponent(term)}&limit=8`);
      const data = (await res.json()) as Paginated<Product>;
      setResults(data.data);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const id = setTimeout(() => runSearch(q), 250);
    return () => clearTimeout(id);
  }, [q, runSearch]);

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center p-4 pt-[10vh]">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative z-10 w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center gap-3 border-b border-blue-bg px-4">
              <Search className="h-5 w-5 text-text-mid" />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={t('placeholder')}
                className="flex-1 py-4 text-sm outline-none"
              />
              {loading && <Loader2 className="h-4 w-4 animate-spin text-blue-mid" />}
              <button onClick={() => setOpen(false)} aria-label="Close">
                <X className="h-5 w-5 text-text-mid" />
              </button>
            </div>

            <div className="max-h-[50vh] overflow-y-auto">
              {q.trim() === '' ? (
                <p className="px-4 py-8 text-center text-sm text-text-mid">{t('hint')}</p>
              ) : results.length === 0 && !loading ? (
                <div className="flex flex-col items-center px-4 py-10 text-center text-text-mid">
                  <PackageSearch className="mb-2 h-8 w-8 opacity-40" />
                  <p className="text-sm">{t('noResults')}</p>
                </div>
              ) : (
                <ul className="py-2">
                  {results.map((p) => (
                    <li key={p.id}>
                      <Link
                        href={`/mahsulotlar/${p.slug}`}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-blue-bg"
                      >
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-blue-bg text-xs font-bold text-blue-dark">
                          {p.brand?.name?.slice(0, 2).toUpperCase() ?? 'PA'}
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-medium text-text-dark">
                            {pick(p, 'name', loc)}
                          </span>
                          <span className="block truncate text-xs text-text-mid">{p.brand?.name}</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
