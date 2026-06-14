'use client';

import { Send, GitCompareArrows, Check } from 'lucide-react';
import type { Product, Specification } from '@pa/types';
import { pick, telegramLink } from '@pa/ui';
import { Link } from '@/i18n/navigation';
import { SmartImage } from './SmartImage';
import { useCompare } from './providers/CompareProvider';

export function ProductCard({
  product,
  locale,
}: {
  product: Product;
  locale: 'uz' | 'ru' | 'en';
}) {
  const name = pick(product, 'name', locale);
  const desc = pick(product, 'description', locale);
  const { has, toggle, isFull } = useCompare();
  const inCompare = has(product.id);
  const topSpecs = ((product.specifications as Specification[] | null) ?? []).slice(0, 3);

  return (
    <div className="card reveal group relative flex flex-col overflow-hidden">
      {/* Compare toggle */}
      <button
        onClick={() => toggle(product)}
        disabled={!inCompare && isFull}
        aria-label="compare"
        title={locale === 'ru' ? 'Сравнить' : locale === 'en' ? 'Compare' : 'Taqqoslash'}
        className={`absolute right-2 top-2 z-10 grid h-8 w-8 place-items-center rounded-full border shadow-sm transition-colors ${
          inCompare
            ? 'border-blue-dark bg-blue-dark text-white'
            : 'border-blue-bg bg-white/90 text-text-mid hover:text-blue-dark disabled:opacity-40'
        }`}
      >
        {inCompare ? <Check className="h-4 w-4" /> : <GitCompareArrows className="h-4 w-4" />}
      </button>

      <div className="relative aspect-[4/3] w-full bg-blue-bg">
        <SmartImage
          src={product.images?.[0]}
          alt={name}
          label={product.brand?.name ?? name}
          className="h-full w-full"
        />
        {product.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-blue-dark px-2.5 py-1 text-xs font-semibold text-white shadow">
            {product.badge}
          </span>
        )}

        {/* Hover quick-spec tooltip */}
        {topSpecs.length > 0 && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 bg-text-dark/90 p-3 text-xs text-white opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
            <ul className="space-y-0.5">
              {topSpecs.map((s, i) => (
                <li key={i} className="flex justify-between gap-2">
                  <span className="text-white/70">{s.label}</span>
                  <span className="font-mono">{s.value}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        {product.brand?.name && (
          <span className="text-xs font-semibold uppercase tracking-wide text-blue-mid">
            {product.brand.name}
          </span>
        )}
        <h3 className="mt-1 line-clamp-2 font-semibold text-text-dark">{name}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-text-mid">{desc}</p>

        <div className="mt-4 flex gap-2">
          <Link href={`/mahsulotlar/${product.slug}`} className="btn-primary flex-1 px-3 py-2 text-xs">
            {locale === 'ru' ? 'Подробнее' : locale === 'en' ? 'Details' : 'Batafsil'}
          </Link>
          <a
            href={telegramLink(product.id)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-telegram px-3 py-2 text-xs"
            aria-label="Telegram"
          >
            <Send className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
