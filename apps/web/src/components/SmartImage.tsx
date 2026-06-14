'use client';

import { useState } from 'react';
import Image from 'next/image';
import { API_URL } from '@/lib/api';

interface Props {
  src?: string | null;
  alt: string;
  label?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

/**
 * Renders an uploaded image via next/image (lazy, responsive, WebP/AVIF where
 * the optimizer can reach the source) and falls back to a branded gradient
 * placeholder if the file is missing or fails to load. Upload paths
 * (/uploads/...) are resolved against the API origin. HTTP (non-TLS) sources —
 * i.e. the local/dev API — are served unoptimized to avoid cross-origin
 * optimizer failures; HTTPS brand URLs are optimized.
 */
export function SmartImage({
  src,
  alt,
  label,
  className,
  sizes = '(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw',
  priority = false,
}: Props) {
  const [failed, setFailed] = useState(false);
  const resolved = src ? (src.startsWith('/uploads') ? `${API_URL}${src}` : src) : null;

  if (!resolved || failed) {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-blue-dark via-blue-mid to-blue-accent text-white/90 ${className ?? ''}`}
      >
        <span className="px-3 text-center text-sm font-semibold">{label ?? alt}</span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className ?? ''}`}>
      <Image
        src={resolved}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        loading={priority ? undefined : 'lazy'}
        onError={() => setFailed(true)}
        unoptimized={resolved.startsWith('http://')}
        className="object-cover"
      />
    </div>
  );
}
