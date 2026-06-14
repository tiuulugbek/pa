'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { FileText, X, Send, Check } from 'lucide-react';
import { postJson } from '@/lib/api';

type Status = 'idle' | 'sending' | 'success' | 'error';

export function QuoteButton() {
  const t = useTranslations('quote');
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [form, setForm] = useState({ name: '', phone: '', message: '' });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');
    try {
      await postJson('/contact', { ...form, message: `[Quote] ${form.message}` });
      setStatus('success');
      setForm({ name: '', phone: '', message: '' });
      setTimeout(() => {
        setOpen(false);
        setStatus('idle');
      }, 2000);
    } catch {
      setStatus('error');
    }
  }

  return (
    <div className="fixed bottom-20 left-4 z-40 lg:bottom-5">
      {open ? (
        <div className="w-72 rounded-2xl border border-blue-bg bg-white p-4 shadow-2xl">
          <div className="mb-3 flex items-center justify-between">
            <span className="font-semibold text-text-dark">{t('title')}</span>
            <button onClick={() => setOpen(false)} aria-label="Close">
              <X className="h-5 w-5 text-text-mid" />
            </button>
          </div>
          {status === 'success' ? (
            <div className="flex flex-col items-center gap-2 py-6 text-green-600">
              <Check className="h-8 w-8" />
              <p className="text-center text-sm">{t('success')}</p>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-2">
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder={t('name')}
                className="w-full rounded-lg border border-blue-bg px-3 py-2 text-sm outline-none focus:border-blue-mid"
              />
              <input
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder={t('phone')}
                className="w-full rounded-lg border border-blue-bg px-3 py-2 text-sm outline-none focus:border-blue-mid"
              />
              <textarea
                required
                rows={3}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder={t('message')}
                className="w-full rounded-lg border border-blue-bg px-3 py-2 text-sm outline-none focus:border-blue-mid"
              />
              <button
                type="submit"
                disabled={status === 'sending'}
                className="btn-telegram w-full py-2.5 text-sm disabled:opacity-60"
              >
                <Send className="h-4 w-4" />
                {t('send')}
              </button>
              {status === 'error' && <p className="text-xs text-red-600">{t('error')}</p>}
            </form>
          )}
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 rounded-full bg-blue-dark px-4 py-3 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-105"
        >
          <FileText className="h-5 w-5" />
          <span className="hidden sm:inline">{t('button')}</span>
        </button>
      )}
    </div>
  );
}
