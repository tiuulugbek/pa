'use client';

import { Home, LayoutGrid, Factory, Phone } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { usePathname } from '@/i18n/navigation';
import { Link } from '@/i18n/navigation';

export function BottomNav() {
  const t = useTranslations('mobileNav');
  const pathname = usePathname();

  const items = [
    { href: '/', label: t('home'), icon: Home, match: (p: string) => p === '/' },
    { href: '/mahsulotlar', label: t('catalog'), icon: LayoutGrid, match: (p: string) => p.startsWith('/mahsulotlar') },
    { href: '/sohalar', label: t('industries'), icon: Factory, match: (p: string) => p.startsWith('/sohalar') },
    { href: '/aloqa', label: t('contact'), icon: Phone, match: (p: string) => p.startsWith('/aloqa') },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-blue-bg bg-white/95 backdrop-blur lg:hidden">
      <ul className="flex">
        {items.map((item) => {
          const active = item.match(pathname);
          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                className={`flex flex-col items-center gap-0.5 py-2 text-[11px] font-medium ${
                  active ? 'text-blue-dark' : 'text-text-mid'
                }`}
              >
                <item.icon className={`h-5 w-5 ${active ? 'text-blue-dark' : 'text-text-mid'}`} />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
