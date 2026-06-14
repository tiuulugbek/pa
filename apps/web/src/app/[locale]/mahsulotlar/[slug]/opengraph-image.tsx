import { ImageResponse } from 'next/og';
import { api } from '@/lib/api';
import { pick } from '@pa/ui';

export const runtime = 'nodejs';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'Power Automation product';

export default async function OgImage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const loc = params.locale === 'ru' ? 'ru' : params.locale === 'en' ? 'en' : 'uz';
  let name = 'Power Automation';
  let brand = '';
  try {
    const product = await api.product(params.slug);
    name = pick(product, 'name', loc);
    brand = product.brand?.name ?? '';
  } catch {
    /* fall back to defaults */
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 64,
          background: 'linear-gradient(135deg, #062c6b 0%, #0A4DB8 55%, #1A7FE8 100%)',
          color: 'white',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 14,
              background: 'white',
              color: '#0A4DB8',
              fontSize: 32,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            PA
          </div>
          <div style={{ fontSize: 30, fontWeight: 700 }}>Power Automation</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {brand ? (
            <div style={{ fontSize: 30, color: '#3BBFFF', marginBottom: 12 }}>{brand}</div>
          ) : null}
          <div style={{ fontSize: 60, fontWeight: 700, lineHeight: 1.1 }}>{name}</div>
        </div>

        <div style={{ fontSize: 26, color: 'rgba(255,255,255,0.85)' }}>
          Industrial instrumentation & automation · powerautomation.uz
        </div>
      </div>
    ),
    size,
  );
}
