import { ProductForm } from '@/components/ProductForm';

export default function EditProductPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-text-dark">Mahsulotni tahrirlash</h1>
      <ProductForm productId={Number(params.id)} />
    </div>
  );
}
