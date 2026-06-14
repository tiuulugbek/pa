import { Link } from '@/i18n/navigation';

export default function NotFound() {
  return (
    <div className="container-x flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h1 className="text-6xl font-bold text-blue-dark">404</h1>
      <p className="mt-4 text-text-mid">Sahifa topilmadi / Страница не найдена</p>
      <Link href="/" className="btn-primary mt-6">
        Bosh sahifa
      </Link>
    </div>
  );
}
