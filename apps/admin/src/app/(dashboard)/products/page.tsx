'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import type { Product } from '@pa/types';
import { adminApi } from '@/lib/api';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    adminApi
      .get<Product[]>('/admin/products')
      .then(setProducts)
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  async function remove(id: number) {
    if (!confirm("Mahsulotni o'chirishni tasdiqlaysizmi?")) return;
    await adminApi.del(`/admin/products/${id}`);
    load();
  }

  const filtered = products.filter((p) =>
    p.nameUz.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-text-dark">Mahsulotlar</h1>
        <Link href="/products/new" className="btn-primary">
          <Plus className="h-4 w-4" /> Yangi qo'shish
        </Link>
      </div>

      <div className="relative mb-4 max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-mid" />
        <input
          className="input pl-9"
          placeholder="Qidirish..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutralbg text-left text-text-mid">
            <tr>
              <th className="px-4 py-3 font-medium">Nomi</th>
              <th className="px-4 py-3 font-medium">Brend</th>
              <th className="px-4 py-3 font-medium">Kategoriya</th>
              <th className="px-4 py-3 font-medium">Holat</th>
              <th className="px-4 py-3 font-medium text-right">Amallar</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-text-mid">Yuklanmoqda...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-text-mid">Mahsulot yo'q</td></tr>
            ) : (
              filtered.map((p) => (
                <tr key={p.id} className="border-t border-blue-bg">
                  <td className="px-4 py-3 font-medium text-text-dark">{p.nameUz}</td>
                  <td className="px-4 py-3 text-text-mid">{p.brand?.name ?? '—'}</td>
                  <td className="px-4 py-3 text-text-mid">{p.category?.nameUz ?? '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs ${p.isActive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                      {p.isActive ? 'Faol' : 'Nofaol'}
                    </span>
                    {p.isFeatured && <span className="ml-1 rounded-full bg-blue-bg px-2 py-0.5 text-xs text-blue-dark">Tavsiya</span>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Link href={`/products/${p.id}/edit`} className="btn-ghost px-2 py-1.5">
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <button onClick={() => remove(p.id)} className="btn-danger px-2 py-1.5">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
