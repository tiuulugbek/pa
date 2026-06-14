import { ChevronRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { COMPANY } from '@/lib/constants';

export interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumb({ items }: { items: Crumb[] }) {
  // JSON-LD for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      item: item.href ? `${COMPANY.siteUrl}${item.href}` : undefined,
    })),
  };

  return (
    <nav aria-label="breadcrumb" className="container-x py-4 text-sm text-text-mid">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1">
            {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-text-mid/50" />}
            {item.href ? (
              <Link href={item.href} className="hover:text-blue-dark">
                {item.label}
              </Link>
            ) : (
              <span className="font-medium text-text-dark">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
