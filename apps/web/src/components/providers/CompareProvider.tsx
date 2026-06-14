'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Product } from '@pa/types';
import { getCookie, setCookie } from '@/lib/cookies';

const MAX = 3;
const COOKIE = 'pa_compare';

interface CompareContextValue {
  items: Product[];
  ids: number[];
  has: (id: number) => boolean;
  toggle: (product: Product) => void;
  remove: (id: number) => void;
  clear: () => void;
  isFull: boolean;
}

const CompareContext = createContext<CompareContextValue | null>(null);

export function CompareProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Product[]>([]);

  // Hydrate from cookie once on mount.
  useEffect(() => {
    const raw = getCookie(COOKIE);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as Product[];
        if (Array.isArray(parsed)) setItems(parsed.slice(0, MAX));
      } catch {
        /* ignore malformed cookie */
      }
    }
  }, []);

  const persist = useCallback((next: Product[]) => {
    setItems(next);
    setCookie(COOKIE, JSON.stringify(next));
  }, []);

  const toggle = useCallback(
    (product: Product) => {
      const exists = items.some((p) => p.id === product.id);
      if (exists) persist(items.filter((p) => p.id !== product.id));
      else if (items.length < MAX) persist([...items, product]);
    },
    [items, persist],
  );

  const remove = useCallback((id: number) => persist(items.filter((p) => p.id !== id)), [items, persist]);
  const clear = useCallback(() => persist([]), [persist]);
  const has = useCallback((id: number) => items.some((p) => p.id === id), [items]);

  const value = useMemo<CompareContextValue>(
    () => ({ items, ids: items.map((p) => p.id), has, toggle, remove, clear, isFull: items.length >= MAX }),
    [items, has, toggle, remove, clear],
  );

  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>;
}

export function useCompare(): CompareContextValue {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error('useCompare must be used within CompareProvider');
  return ctx;
}
