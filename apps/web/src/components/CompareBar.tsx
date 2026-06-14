'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { GitCompareArrows, X } from 'lucide-react';
import { pick } from '@pa/ui';
import { Link } from '@/i18n/navigation';
import { useCompare } from './providers/CompareProvider';

export function CompareBar() {
  const t = useTranslations('compare');
  const params = useParams();
  const loc = params.locale === 'ru' ? 'ru' : params.locale === 'en' ? 'en' : 'uz';
  const { items, remove, clear } = useCompare();

  if (items.length === 0) return null;

  return (
    <div className="fixed inset-x-0 bottom-14 z-40 lg:bottom-0">
      <div className="container-x">
        <div className="mb-2 flex items-center gap-3 rounded-2xl border border-blue-bg bg-white/95 p-3 shadow-2xl backdrop-blur lg:mb-3">
          <div className="hidden items-center gap-2 text-sm font-semibold text-text-dark sm:flex">
            <GitCompareArrows className="h-5 w-5 text-blue-dark" />
            {items.length}/3
          </div>
          <ul className="flex flex-1 items-center gap-2 overflow-x-auto">
            {items.map((p) => (
              <li
                key={p.id}
                className="flex shrink-0 items-center gap-1 rounded-lg bg-blue-bg px-2 py-1 text-xs text-blue-dark"
              >
                <span className="max-w-[140px] truncate">{pick(p, 'name', loc)}</span>
                <button onClick={() => remove(p.id)} aria-label="remove">
                  <X className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>
          <button onClick={clear} className="text-xs text-text-mid hover:text-red-600">
            {t('clear')}
          </button>
          <Link href="/taqqoslash" className="btn-primary px-4 py-2 text-xs">
            <GitCompareArrows className="h-4 w-4" />
            {t('compareNow')}
          </Link>
        </div>
      </div>
    </div>
  );
}
