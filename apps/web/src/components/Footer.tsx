import { getTranslations } from 'next-intl/server';
import { Send, Phone, Mail, MapPin } from 'lucide-react';
import type { Category } from '@pa/types';
import { pick, telegramLink } from '@pa/ui';
import { Link } from '@/i18n/navigation';
import { COMPANY } from '@/lib/constants';

export async function Footer({
  locale,
  categories,
}: {
  locale: string;
  categories: Category[];
}) {
  const t = await getTranslations('footer');
  const tn = await getTranslations('nav');
  const loc = locale === 'ru' ? 'ru' : locale === 'en' ? 'en' : 'uz';
  const address = loc === 'ru' ? COMPANY.addressRu : COMPANY.addressUz;

  return (
    <footer className="mt-20 bg-text-dark text-white/80">
      <div className="container-x grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 text-white">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-blue-mid font-bold">
              PA
            </span>
            <span className="text-lg font-bold">Power Automation</span>
          </div>
          <p className="mt-4 text-sm leading-relaxed">{t('about')}</p>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">
            {t('quickLinks')}
          </h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/mahsulotlar" className="hover:text-white">{tn('products')}</Link></li>
            <li><Link href="/sohalar" className="hover:text-white">{tn('industries')}</Link></li>
            <li><Link href="/loyihalar" className="hover:text-white">{tn('projects')}</Link></li>
            <li><Link href="/haqimizda" className="hover:text-white">{tn('about')}</Link></li>
            <li><Link href="/yangiliklar" className="hover:text-white">{tn('news')}</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">
            {t('categories')}
          </h3>
          <ul className="space-y-2 text-sm">
            {categories.slice(0, 6).map((cat) => (
              <li key={cat.id}>
                <Link
                  href={`/mahsulotlar?category=${cat.id}`}
                  className="hover:text-white"
                >
                  {pick(cat, 'name', loc)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">
            {t('contact')}
          </h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" /> {address}
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <a href={`tel:${COMPANY.phoneHref}`} className="hover:text-white">
                {COMPANY.phone}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <a href={`mailto:${COMPANY.email}`} className="hover:text-white">
                {COMPANY.email}
              </a>
            </li>
            <li>
              <a
                href={telegramLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-telegram mt-1 px-4 py-2 text-sm"
              >
                <Send className="h-4 w-4" /> {COMPANY.telegram}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-5 text-center text-xs">
        © {new Date().getFullYear()} {COMPANY.name}. {t('rights')}
      </div>
    </footer>
  );
}
