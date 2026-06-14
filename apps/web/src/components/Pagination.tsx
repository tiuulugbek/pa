'use client';

import { useRouter, usePathname } from '@/i18n/navigation';
import { useSearchParams } from 'next/navigation';

export function Pagination({ page, totalPages }: { page: number; totalPages: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  if (totalPages <= 1) return null;

  const go = (p: number) => {
    const next = new URLSearchParams(params.toString());
    next.set('page', String(p));
    router.push(`${pathname}?${next.toString()}`);
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="mt-10 flex justify-center gap-2">
      <button
        disabled={page <= 1}
        onClick={() => go(page - 1)}
        className="rounded-lg border border-blue-bg bg-white px-3 py-2 text-sm disabled:opacity-40"
      >
        ‹
      </button>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => go(p)}
          className={`rounded-lg border px-3.5 py-2 text-sm ${
            p === page
              ? 'border-blue-dark bg-blue-dark text-white'
              : 'border-blue-bg bg-white text-text-mid hover:border-blue-mid'
          }`}
        >
          {p}
        </button>
      ))}
      <button
        disabled={page >= totalPages}
        onClick={() => go(page + 1)}
        className="rounded-lg border border-blue-bg bg-white px-3 py-2 text-sm disabled:opacity-40"
      >
        ›
      </button>
    </div>
  );
}
