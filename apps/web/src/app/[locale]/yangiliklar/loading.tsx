import { Skeleton } from '@/components/Skeleton';

export default function Loading() {
  return (
    <div className="container-x py-8">
      <Skeleton className="mb-3 h-9 w-56" />
      <Skeleton className="mb-8 h-4 w-80" />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="card overflow-hidden">
            <Skeleton className="aspect-[16/9] w-full rounded-none" />
            <div className="space-y-2 p-5">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-5 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
