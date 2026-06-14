import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'Power Automation — reliable solutions for industry';

const TAGLINE: Record<string, string> = {
  uz: 'Sanoat uchun ishonchli yechimlar',
  ru: 'Надёжные решения для промышленности',
  en: 'Reliable solutions for industry',
};

export default function OgImage({ params }: { params: { locale: string } }) {
  const tagline = TAGLINE[params.locale] ?? TAGLINE.uz;
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 24,
          padding: 80,
          background: 'linear-gradient(135deg, #062c6b 0%, #0A4DB8 55%, #1A7FE8 100%)',
          color: 'white',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 16,
              background: 'white',
              color: '#0A4DB8',
              fontSize: 36,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            PA
          </div>
          <div style={{ fontSize: 40, fontWeight: 700 }}>Power Automation</div>
        </div>
        <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.1, maxWidth: 900 }}>{tagline}</div>
        <div style={{ fontSize: 28, color: 'rgba(255,255,255,0.85)' }}>
          Oil &amp; Gas · Chemical · Mining · Energy — powerautomation.uz
        </div>
      </div>
    ),
    size,
  );
}
