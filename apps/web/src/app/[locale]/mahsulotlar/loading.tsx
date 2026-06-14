import { Skeleton, ProductGridSkeleton } from '@/components/Skeleton';

export default function Loading() {
  return (
    <div className="container-x py-8">
      <Skeleton className="mb-6 h-9 w-64" />
      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="hidden w-[260px] shrink-0 space-y-3 lg:block">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-5 w-full" />
          ))}
        </div>
        <div className="flex-1">
          <ProductGridSkeleton count={9} />
        </div>
      </div>
    </div>
  );
}
