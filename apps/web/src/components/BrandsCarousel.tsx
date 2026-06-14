import type { Brand } from '@pa/types';

export function BrandsCarousel({ brands }: { brands: Brand[] }) {
  if (brands.length === 0) return null;
  // Duplicate the list so the CSS scroll loops seamlessly.
  const loop = [...brands, ...brands];

  return (
    <div className="relative overflow-hidden py-4">
      <div className="flex w-max animate-scroll items-center gap-12">
        {loop.map((brand, i) => (
          <div
            key={`${brand.id}-${i}`}
            className="flex h-16 min-w-[140px] items-center justify-center grayscale transition-all duration-300 hover:grayscale-0"
          >
            <span className="text-xl font-bold text-text-mid hover:text-blue-dark">
              {brand.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
