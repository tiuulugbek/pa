import { NewsForm } from '@/components/NewsForm';

export default function EditNewsPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-text-dark">Maqolani tahrirlash</h1>
      <NewsForm newsId={Number(params.id)} />
    </div>
  );
}
