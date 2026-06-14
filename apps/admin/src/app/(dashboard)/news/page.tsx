'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import type { NewsPost } from '@pa/types';
import { adminApi } from '@/lib/api';

export default function NewsListPage() {
  const [items, setItems] = useState<NewsPost[]>([]);
  const load = () => adminApi.get<NewsPost[]>('/admin/news').then(setItems);
  useEffect(() => { load(); }, []);

  async function remove(id: number) {
    if (!confirm("O'chirilsinmi?")) return;
    await adminApi.del(`/admin/news/${id}`);
    load();
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text-dark">Yangiliklar</h1>
        <Link href="/news/new" className="btn-primary"><Plus className="h-4 w-4" /> Yangi maqola</Link>
      </div>
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutralbg text-left text-text-mid">
            <tr>
              <th className="px-4 py-3 font-medium">Sarlavha</th>
              <th className="px-4 py-3 font-medium">Kategoriya</th>
              <th className="px-4 py-3 font-medium">Holat</th>
              <th className="px-4 py-3 font-medium text-right">Amallar</th>
            </tr>
          </thead>
          <tbody>
            {items.map((n) => (
              <tr key={n.id} className="border-t border-blue-bg">
                <td className="px-4 py-3 font-medium text-text-dark">{n.titleUz}</td>
                <td className="px-4 py-3 text-text-mid">{n.category ?? '—'}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs ${n.isPublished ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>
                    {n.isPublished ? 'Chop etilgan' : 'Qoralama'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Link href={`/news/${n.id}/edit`} className="btn-ghost px-2 py-1.5"><Pencil className="h-4 w-4" /></Link>
                    <button onClick={() => remove(n.id)} className="btn-danger px-2 py-1.5"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
