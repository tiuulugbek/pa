'use client';

import { useState } from 'react';
import { SmartImage } from './SmartImage';

export function ProductGallery({ images, label }: { images: string[]; label: string }) {
  const list = images.length > 0 ? images : [''];
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="aspect-square w-full overflow-hidden rounded-xl border border-blue-bg bg-white">
        <SmartImage src={list[active]} alt={label} label={label} className="h-full w-full" />
      </div>
      {list.length > 1 && (
        <div className="mt-3 flex gap-2">
          {list.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`h-16 w-16 overflow-hidden rounded-lg border ${
                i === active ? 'border-blue-dark' : 'border-blue-bg'
              }`}
            >
              <SmartImage src={img} alt={`${label} ${i + 1}`} label={label} className="h-full w-full" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
