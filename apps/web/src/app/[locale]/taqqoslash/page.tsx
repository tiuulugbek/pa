'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { Send, X, GitCompareArrows } from 'lucide-react';
import type { Specification } from '@pa/types';
import { pick, telegramLink } from '@pa/ui';
import { Link } from '@/i18n/navigation';
import { SmartImage } from '@/components/SmartImage';
import { useCompare } from '@/components/providers/CompareProvider';

export default function ComparePage() {
  const t = useTranslations('compare');
  const tc = useTranslations('common');
  const params = useParams();
  const loc = params.locale === 'ru' ? 'ru' : params.locale === 'en' ? 'en' : 'uz';
  const { items, remove } = useCompare();

  if (items.length === 0) {
    return (
      <div className="container-x flex min-h-[50vh] flex-col items-center justify-center text-center">
        <GitCompareArrows className="mb-4 h-12 w-12 text-blue-mid/40" />
        <p className="max-w-sm text-text-mid">{t('empty')}</p>
        <Link href="/mahsulotlar" className="btn-primary mt-6">
          {tc('details')}
        </Link>
      </div>
    );
  }

  // Union of all spec labels (preserve first-seen order).
  const labels: string[] = [];
  for (const p of items) {
    for (const s of (p.specifications as Specification[] | null) ?? []) {
      if (!labels.includes(s.label)) labels.push(s.label);
    }
  }
  const specOf = (specs: Specification[] | null, label: string) =>
    (specs ?? []).find((s) => s.label === label)?.value ?? '—';

  return (
    <div className="container-x py-8">
      <h1 className="mb-6 flex items-center gap-2 text-2xl font-bold text-text-dark sm:text-3xl">
        <GitCompareArrows className="h-7 w-7 text-blue-dark" /> {t('title')}
      </h1>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-separate border-spacing-0">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 bg-neutralbg p-3 text-left text-sm font-medium text-text-mid">
                {t('spec')}
              </th>
              {items.map((p) => (
                <th key={p.id} className="min-w-[200px] p-3 align-top">
                  <div className="card relative p-3">
                    <button
                      onClick={() => remove(p.id)}
                      className="absolute right-2 top-2 text-text-mid hover:text-red-600"
                      aria-label="remove"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <div className="aspect-[4/3] w-full overflow-hidden rounded-lg">
                      <SmartImage src={p.images?.[0]} alt={pick(p, 'name', loc)} label={p.brand?.name} className="h-full w-full" />
                    </div>
                    <span className="mt-2 block text-xs font-semibold uppercase text-blue-mid">{p.brand?.name}</span>
                    <Link href={`/mahsulotlar/${p.slug}`} className="mt-1 block text-sm font-semibold text-text-dark hover:underline">
                      {pick(p, 'name', loc)}
                    </Link>
                    <a
                      href={telegramLink(p.id)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-telegram mt-2 w-full py-1.5 text-xs"
                    >
                      <Send className="h-3.5 w-3.5" /> Telegram
                    </a>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {labels.map((label, i) => (
              <tr key={label} className={i % 2 ? 'bg-white' : 'bg-neutralbg'}>
                <td className="sticky left-0 z-10 border-t border-blue-bg bg-inherit p-3 text-sm font-medium text-text-mid">
                  {label}
                </td>
                {items.map((p) => (
                  <td key={p.id} className="border-t border-blue-bg p-3 text-center font-mono text-sm text-text-dark">
                    {specOf(p.specifications as Specification[] | null, label)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
