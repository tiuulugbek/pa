'use client';

import { useEffect } from 'react';
import { RotateCcw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container-x flex min-h-[60vh] flex-col items-center justify-center text-center">
      <span className="grid h-16 w-16 place-items-center rounded-2xl bg-blue-dark text-2xl font-bold text-white">
        500
      </span>
      <h1 className="mt-6 text-2xl font-bold text-text-dark">Xatolik yuz berdi</h1>
      <p className="mt-2 max-w-md text-text-mid">
        Serverda kutilmagan xatolik. Iltimos, sahifani qaytadan yuklang. / Произошла ошибка. /
        Something went wrong.
      </p>
      <button onClick={reset} className="btn-primary mt-6">
        <RotateCcw className="h-4 w-4" />
        Qaytadan urinish
      </button>
    </div>
  );
}
