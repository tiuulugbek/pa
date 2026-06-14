'use client';

import { useTransition } from 'react';
import { usePathname, useRouter } from '@/i18n/navigation';
import { useParams } from 'next/navigation';

export function LangSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const current = (params.locale as string) || 'uz';
  const [isPending, startTransition] = useTransition();

  function switchTo(locale: 'uz' | 'ru' | 'en') {
    if (locale === current) return;
    startTransition(() => {
      router.replace(pathname, { locale });
    });
  }

  return (
    <div className="flex items-center gap-1 text-sm font-medium" aria-busy={isPending}>
      {(['uz', 'ru', 'en'] as const).map((l) => (
        <button
          key={l}
          onClick={() => switchTo(l)}
          className={`rounded px-2 py-1 uppercase transition-colors ${
            current === l ? 'bg-blue-bg text-blue-dark' : 'text-text-mid hover:text-blue-dark'
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
