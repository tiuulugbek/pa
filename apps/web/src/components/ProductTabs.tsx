'use client';

import { useState, type ReactNode } from 'react';
import { useTranslations } from 'next-intl';

interface Tab {
  key: string;
  labelKey: 'overview' | 'specifications' | 'documents' | 'related';
  content: ReactNode;
  hidden?: boolean;
}

export function ProductTabs({ tabs }: { tabs: Tab[] }) {
  const t = useTranslations('productTabs');
  const visible = tabs.filter((tab) => !tab.hidden);
  const [active, setActive] = useState(visible[0]?.key ?? '');

  return (
    <div className="mt-12">
      <div className="flex flex-wrap gap-1 border-b border-blue-bg">
        {visible.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActive(tab.key)}
            className={`-mb-px border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
              active === tab.key
                ? 'border-blue-dark text-blue-dark'
                : 'border-transparent text-text-mid hover:text-blue-dark'
            }`}
          >
            {t(tab.labelKey)}
          </button>
        ))}
      </div>
      <div className="pt-6">
        {visible.map((tab) => (
          <div key={tab.key} className={active === tab.key ? 'block' : 'hidden'}>
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
}
