import { PackageSearch } from 'lucide-react';
import type { ReactNode } from 'react';

export function EmptyState({
  title,
  hint,
  action,
}: {
  title: string;
  hint?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-blue-bg bg-white px-6 py-16 text-center">
      <div className="mb-4 grid h-16 w-16 place-items-center rounded-full bg-blue-bg text-blue-mid">
        <PackageSearch className="h-8 w-8" />
      </div>
      <p className="text-lg font-semibold text-text-dark">{title}</p>
      {hint && <p className="mt-1 max-w-sm text-sm text-text-mid">{hint}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
