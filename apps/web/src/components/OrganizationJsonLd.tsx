import { COMPANY } from '@/lib/constants';

/** Organization + WebSite structured data (rendered once, site-wide). */
export function OrganizationJsonLd() {
  const data = [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: COMPANY.name,
      url: COMPANY.siteUrl,
      logo: `${COMPANY.siteUrl}/icon.png`,
      email: COMPANY.email,
      telephone: COMPANY.phone,
      address: {
        '@type': 'PostalAddress',
        streetAddress: COMPANY.addressEn ?? COMPANY.addressUz,
        addressLocality: 'Tashkent',
        addressCountry: 'UZ',
      },
      sameAs: [`https://t.me/${COMPANY.telegram.replace(/^@/, '')}`],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: COMPANY.name,
      url: COMPANY.siteUrl,
    },
  ];
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
