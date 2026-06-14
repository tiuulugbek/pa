'use client';

import { Send } from 'lucide-react';
import { telegramLink } from '@pa/ui';

/**
 * Floating Telegram contact button.
 * Desktop: sticky bottom-right. Mobile: bottom FAB. Pulses every 8s.
 */
export function TelegramCTA() {
  return (
    <a
      href={telegramLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Telegram"
      className="animate-pulse-ring fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-telegram text-white shadow-lg transition-transform hover:scale-110"
    >
      <Send className="h-6 w-6" />
    </a>
  );
}
