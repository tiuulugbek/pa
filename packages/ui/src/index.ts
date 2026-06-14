import type { Industry, Locale } from '@pa/types';

// ---------------- Design tokens ----------------
export const colors = {
  blueDark: '#0A4DB8',
  blueMid: '#1A7FE8',
  blueAccent: '#3BBFFF',
  blueBg: '#EBF4FF',
  neutralBg: '#F5F7FA',
  textDark: '#0D1B3E',
  textMid: '#334E7B',
  telegram: '#229ED9',
} as const;

// ---------------- Industry metadata ----------------
export interface IndustryMeta {
  key: Industry;
  slug: string;
  uz: string;
  ru: string;
  en: string;
  icon: string; // lucide icon name
  descUz: string;
  descRu: string;
  descEn: string;
}

export const INDUSTRY_META: IndustryMeta[] = [
  {
    key: 'oil_gas',
    slug: 'neft-gaz',
    uz: 'Neft va gaz',
    ru: 'Нефть и газ',
    en: 'Oil & Gas',
    icon: 'flame',
    descUz: 'Qazib olish, qayta ishlash va transport uchun KIP va avtomatlashtirish.',
    descRu: 'КИП и автоматизация для добычи, переработки и транспортировки.',
    descEn: 'Instrumentation and automation for extraction, processing and transport.',
  },
  {
    key: 'chemical',
    slug: 'kimyo',
    uz: 'Kimyo sanoati',
    ru: 'Химическая промышленность',
    en: 'Chemical Industry',
    icon: 'flask-conical',
    descUz: 'Agressiv muhitlar uchun korroziyabardosh oʻlchov yechimlari.',
    descRu: 'Коррозионностойкие решения для агрессивных сред.',
    descEn: 'Corrosion-resistant measurement solutions for aggressive media.',
  },
  {
    key: 'mining',
    slug: 'togkon',
    uz: 'Togʻ-kon',
    ru: 'Горнодобыча',
    en: 'Mining',
    icon: 'mountain',
    descUz: 'Konchilik va metallurgiya jarayonlarini boshqarish tizimlari.',
    descRu: 'Системы управления для горнодобычи и металлургии.',
    descEn: 'Control systems for mining and metallurgical processes.',
  },
  {
    key: 'energy',
    slug: 'energetika',
    uz: 'Energetika',
    ru: 'Энергетика',
    en: 'Energy',
    icon: 'zap',
    descUz: 'Issiqlik va elektr stansiyalari uchun monitoring va boshqaruv.',
    descRu: 'Мониторинг и управление для тепло- и электростанций.',
    descEn: 'Monitoring and control for thermal and power plants.',
  },
  {
    key: 'food',
    slug: 'oziq-ovqat',
    uz: 'Oziq-ovqat',
    ru: 'Пищевая промышленность',
    en: 'Food & Beverage',
    icon: 'wheat',
    descUz: 'Gigiyenik standartlarga mos oʻlchov va boshqaruv vositalari.',
    descRu: 'Гигиеничные средства измерения и управления.',
    descEn: 'Hygienic measurement and control instruments.',
  },
  {
    key: 'water',
    slug: 'suv',
    uz: 'Suv taʼminoti',
    ru: 'Водоснабжение',
    en: 'Water Supply',
    icon: 'droplets',
    descUz: 'Suv tozalash va taqsimlash inshootlari uchun yechimlar.',
    descRu: 'Решения для водоочистки и распределения.',
    descEn: 'Solutions for water treatment and distribution facilities.',
  },
];

export function industryBySlug(slug: string): IndustryMeta | undefined {
  return INDUSTRY_META.find((i) => i.slug === slug);
}

export function industryByKey(key: string): IndustryMeta | undefined {
  return INDUSTRY_META.find((i) => i.key === key);
}

export function industryLabel(key: string, locale: Locale): string {
  const meta = industryByKey(key);
  if (!meta) return key;
  return locale === 'ru' ? meta.ru : locale === 'en' ? meta.en : meta.uz;
}

export function industryDesc(key: string, locale: Locale): string {
  const meta = industryByKey(key);
  if (!meta) return '';
  return locale === 'ru' ? meta.descRu : locale === 'en' ? meta.descEn : meta.descUz;
}

// ---------------- Telegram helpers ----------------
export const TELEGRAM_BOT = (process.env.NEXT_PUBLIC_TELEGRAM_BOT || '@power_automation_bot').replace(
  /^@/,
  '',
);

/** Deep-link to the bot, optionally with a product start payload. */
export function telegramLink(productId?: number): string {
  const base = `https://t.me/${TELEGRAM_BOT}`;
  return productId ? `${base}?start=product_${productId}` : base;
}

// ---------------- Locale field picker ----------------
// En is optional (records may predate the English columns), so it falls back
// to the Uzbek value when empty.
type Localized<K extends string> = Record<`${K}Uz` | `${K}Ru`, string | null> &
  Partial<Record<`${K}En`, string | null>>;

export function pick<K extends string>(obj: Localized<K>, field: K, locale: Locale): string {
  const suffix = locale === 'ru' ? 'Ru' : locale === 'en' ? 'En' : 'Uz';
  const value = obj[`${field}${suffix}` as keyof typeof obj] as string | null | undefined;
  if (value) return value;
  // Fallback to Uzbek (the canonical/default locale).
  return (obj[`${field}Uz` as keyof typeof obj] as string | null) ?? '';
}
