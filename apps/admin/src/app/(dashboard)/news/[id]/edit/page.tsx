import { NewsForm } from '@/components/NewsForm';

export default async function EditNewsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-text-dark">Maqolani tahrirlash</h1>
      <NewsForm newsId={Number(id)} />
    </div>
  );
}
