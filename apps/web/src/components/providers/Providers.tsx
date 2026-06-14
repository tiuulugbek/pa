'use client';

import type { ReactNode } from 'react';
import { CompareProvider } from './CompareProvider';
import { CompareBar } from '../CompareBar';
import { BottomNav } from '../BottomNav';
import { QuoteButton } from '../QuoteButton';
import { TelegramCTA } from '../TelegramCTA';
import { SearchModal } from '../SearchModal';

/**
 * Client-side providers + globally-mounted floating UI. Wraps the app so the
 * compare context is available everywhere (product cards, compare bar/page).
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <CompareProvider>
      {children}
      <SearchModal />
      <TelegramCTA />
      <QuoteButton />
      <CompareBar />
      <BottomNav />
    </CompareProvider>
  );
}
