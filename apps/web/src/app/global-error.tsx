'use client';

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="uz">
      <body
        style={{
          fontFamily: 'system-ui, sans-serif',
          display: 'flex',
          minHeight: '100vh',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
          background: '#F5F7FA',
          color: '#0D1B3E',
          textAlign: 'center',
          padding: 24,
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 16,
            background: '#0A4DB8',
            color: 'white',
            display: 'grid',
            placeItems: 'center',
            fontWeight: 700,
            fontSize: 24,
          }}
        >
          500
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>Xatolik yuz berdi</h1>
        <button
          onClick={reset}
          style={{
            background: '#0A4DB8',
            color: 'white',
            border: 0,
            borderRadius: 8,
            padding: '10px 20px',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          Qaytadan urinish
        </button>
      </body>
    </html>
  );
}
