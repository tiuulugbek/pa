'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Defers loading the (heavy) Yandex Maps iframe until it scrolls into view,
 * keeping it off the critical path and out of the initial bundle/network.
 */
export function MapEmbed() {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) {
      setShow(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShow(true);
          obs.disconnect();
        }
      },
      { rootMargin: '200px' },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="overflow-hidden rounded-xl border border-blue-bg">
      {show ? (
        <iframe
          title="map"
          src="https://yandex.uz/map-widget/v1/?ll=69.279737%2C41.311158&z=12"
          width="100%"
          height="320"
          frameBorder="0"
          loading="lazy"
          className="block"
        />
      ) : (
        <div className="skeleton h-[320px] w-full" />
      )}
    </div>
  );
}
