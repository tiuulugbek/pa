'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  Menu, X, ChevronDown, Send, Search, Gauge, GitFork, Cpu, ShieldCheck, Code2, Zap, Box,
  type LucideIcon,
} from 'lucide-react';
import type { Category, Product } from '@pa/types';
import { pick, telegramLink } from '@pa/ui';
import { Link, usePathname } from '@/i18n/navigation';
import { LangSwitcher } from './LangSwitcher';
import { ThemeToggle } from './ThemeToggle';
import { SmartImage } from './SmartImage';

const CAT_ICONS: Record<string, LucideIcon> = {
  gauge: Gauge, valve: GitFork, cpu: Cpu, shield: ShieldCheck, code: Code2, bolt: Zap,
};

function openSearch() {
  window.dispatchEvent(new Event('pa:search-open'));
}

export function Header({
  locale,
  categories,
  featured,
}: {
  locale: string;
  categories: Category[];
  featured: Product[];
}) {
  const t = useTranslations('nav');
  const th = useTranslations('home');
  const ts = useTranslations('search');
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const loc = locale === 'ru' ? 'ru' : locale === 'en' ? 'en' : 'uz';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks: { href: string; label: string; mega?: boolean }[] = [
    { href: '/mahsulotlar', label: t('products'), mega: true },
    { href: '/sohalar', label: t('industries') },
    { href: '/loyihalar', label: t('projects') },
    { href: '/haqimizda', label: t('about') },
    { href: '/yangiliklar', label: t('news') },
    { href: '/aloqa', label: t('contact') },
  ];

  const isActive = (href: string) =>
    href === '/mahsulotlar' ? pathname.startsWith('/mahsulotlar') : pathname.startsWith(href);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 shadow-md backdrop-blur-md' : 'bg-white/80 backdrop-blur-sm'
      }`}
    >
      {/* Row 1: logo · search · actions */}
      <div className="container-x flex h-16 items-center gap-4">
        <Link href="/" className="flex shrink-0 items-center gap-2 text-blue-dark">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-blue-dark text-white font-bold">PA</span>
          <span className="hidden text-lg font-bold tracking-tight sm:inline">Power Automation</span>
        </Link>

        {/* Prominent search bar (desktop) */}
        <button
          onClick={openSearch}
          className="mx-auto hidden w-full max-w-lg items-center gap-2 rounded-xl border border-blue-bg bg-neutralbg px-4 py-2.5 text-sm text-text-mid transition-colors hover:border-blue-mid hover:bg-white md:flex"
        >
          <Search className="h-4 w-4" />
          <span className="flex-1 text-left">{ts('placeholder')}</span>
          <kbd className="rounded bg-blue-bg px-1.5 py-0.5 text-[10px] font-semibold text-blue-dark">⌘K</kbd>
        </button>

        <div className="ml-auto flex items-center gap-1 md:gap-2">
          {/* Mobile search icon */}
          <button
            onClick={openSearch}
            aria-label={ts('open')}
            className="grid h-9 w-9 place-items-center rounded-lg text-text-mid hover:bg-blue-bg hover:text-blue-dark md:hidden"
          >
            <Search className="h-5 w-5" />
          </button>
          <ThemeToggle />
          <div className="hidden md:block">
            <LangSwitcher />
          </div>
          <a
            href={telegramLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-telegram hidden px-4 py-2 text-sm lg:inline-flex"
          >
            <Send className="h-4 w-4" />
            Telegram
          </a>
          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menu"
            className="grid h-9 w-9 place-items-center rounded-lg text-text-dark lg:hidden"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Row 2: nav links (desktop) */}
      <div className="hidden border-t border-blue-bg/60 lg:block">
        <nav className="container-x flex h-11 items-center justify-center gap-1">
          {navLinks.map((item) =>
            item.mega ? (
              <div
                key={item.href}
                className="relative"
                onMouseEnter={() => setMegaOpen(true)}
                onMouseLeave={() => setMegaOpen(false)}
              >
                <Link
                  href={item.href}
                  className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                    isActive(item.href) ? 'text-blue-dark' : 'text-text-mid hover:text-blue-dark'
                  }`}
                >
                  {item.label}
                  <ChevronDown className="h-4 w-4" />
                </Link>
                {megaOpen && (
                  <div className="absolute left-1/2 top-full grid w-[820px] max-w-[calc(100vw_-_3rem)] -translate-x-1/2 grid-cols-3 gap-5 rounded-xl border border-blue-bg bg-white p-5 shadow-xl">
                    <div className="col-span-2 grid grid-cols-2 gap-x-6 gap-y-4">
                      {categories.map((cat) => {
                        const Icon = CAT_ICONS[cat.icon ?? ''] ?? Box;
                        return (
                          <div key={cat.id}>
                            <Link
                              href={`/mahsulotlar?category=${cat.id}`}
                              className="flex items-center gap-2 text-sm font-semibold text-blue-dark hover:underline"
                            >
                              <span className="grid h-7 w-7 place-items-center rounded-md bg-blue-bg text-blue-dark">
                                <Icon className="h-4 w-4" />
                              </span>
                              {pick(cat, 'name', loc)}
                            </Link>
                            <ul className="ml-9 mt-1 space-y-0.5">
                              {(cat.children ?? []).slice(0, 4).map((child) => (
                                <li key={child.id}>
                                  <Link
                                    href={`/mahsulotlar?category=${child.id}`}
                                    className="text-xs text-text-mid hover:text-blue-mid"
                                  >
                                    {pick(child, 'name', loc)}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        );
                      })}
                    </div>
                    <div className="rounded-lg bg-neutralbg p-3">
                      <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-text-mid">
                        {th('featuredTitle')}
                      </span>
                      {featured.slice(0, 2).map((p) => (
                        <Link
                          key={p.id}
                          href={`/mahsulotlar/${p.slug}`}
                          className="mb-2 block overflow-hidden rounded-lg border border-blue-bg bg-white"
                        >
                          <div className="aspect-[16/9] w-full">
                            <SmartImage src={p.images?.[0]} alt={pick(p, 'name', loc)} label={p.brand?.name} className="h-full w-full" sizes="240px" />
                          </div>
                          <span className="block px-2 py-1.5 text-xs font-medium text-text-dark line-clamp-1">
                            {pick(p, 'name', loc)}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  isActive(item.href) ? 'text-blue-dark' : 'text-text-mid hover:text-blue-dark'
                }`}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="border-t border-blue-bg bg-white lg:hidden">
          <nav className="container-x flex flex-col py-3">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`rounded-lg px-2 py-3 text-sm font-medium hover:bg-blue-bg ${
                  isActive(item.href) ? 'text-blue-dark' : 'text-text-dark'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 flex items-center justify-between px-2">
              <LangSwitcher />
              <a href={telegramLink()} target="_blank" rel="noopener noreferrer" className="btn-telegram px-4 py-2 text-sm">
                <Send className="h-4 w-4" />
                Telegram
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
