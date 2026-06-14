'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Send } from 'lucide-react';
import { INDUSTRY_META } from '@pa/ui';
import { postJson } from '@/lib/api';

type Status = 'idle' | 'sending' | 'success' | 'error';

export function ContactForm({ locale }: { locale: 'uz' | 'ru' | 'en' }) {
  const t = useTranslations('contact');
  const [status, setStatus] = useState<Status>('idle');
  const [form, setForm] = useState({ name: '', company: '', phone: '', industry: '', message: '' });

  const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');
    try {
      await postJson('/contact', form);
      setStatus('success');
      setForm({ name: '', company: '', phone: '', industry: '', message: '' });
    } catch {
      setStatus('error');
    }
  }

  const inputCls =
    'w-full rounded-lg border border-blue-bg bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-mid';

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <input required value={form.name} onChange={update('name')} placeholder={t('formName')} className={inputCls} />
      <input value={form.company} onChange={update('company')} placeholder={t('formCompany')} className={inputCls} />
      <input required value={form.phone} onChange={update('phone')} placeholder={t('formPhone')} className={inputCls} />
      <select value={form.industry} onChange={update('industry')} className={inputCls}>
        <option value="">{t('formIndustry')}</option>
        {INDUSTRY_META.map((ind) => (
          <option key={ind.key} value={locale === 'ru' ? ind.ru : locale === 'en' ? ind.en : ind.uz}>
            {locale === 'ru' ? ind.ru : locale === 'en' ? ind.en : ind.uz}
          </option>
        ))}
      </select>
      <textarea
        required
        rows={4}
        value={form.message}
        onChange={update('message')}
        placeholder={t('formMessage')}
        className={inputCls}
      />

      <button type="submit" disabled={status === 'sending'} className="btn-telegram w-full py-3 disabled:opacity-60">
        <Send className="h-4 w-4" />
        {status === 'sending' ? t('formSending') : t('formSubmit')}
      </button>

      {status === 'success' && <p className="text-sm font-medium text-green-600">{t('formSuccess')}</p>}
      {status === 'error' && <p className="text-sm font-medium text-red-600">{t('formError')}</p>}
    </form>
  );
}
