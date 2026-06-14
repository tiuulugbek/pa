'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import type { Project } from '@pa/types';
import { adminApi } from '@/lib/api';

export default function ProjectsListPage() {
  const [items, setItems] = useState<Project[]>([]);
  const load = () => adminApi.get<Project[]>('/admin/projects').then(setItems);
  useEffect(() => { load(); }, []);

  async function remove(id: number) {
    if (!confirm("O'chirilsinmi?")) return;
    await adminApi.del(`/admin/projects/${id}`);
    load();
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text-dark">Loyihalar</h1>
        <Link href="/projects/new" className="btn-primary"><Plus className="h-4 w-4" /> Yangi loyiha</Link>
      </div>
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutralbg text-left text-text-mid">
            <tr>
              <th className="px-4 py-3 font-medium">Nomi</th>
              <th className="px-4 py-3 font-medium">Soha</th>
              <th className="px-4 py-3 font-medium">Joylashuv</th>
              <th className="px-4 py-3 font-medium">Yil</th>
              <th className="px-4 py-3 font-medium text-right">Amallar</th>
            </tr>
          </thead>
          <tbody>
            {items.map((p) => (
              <tr key={p.id} className="border-t border-blue-bg">
                <td className="px-4 py-3 font-medium text-text-dark">{p.titleUz}</td>
                <td className="px-4 py-3 text-text-mid">{p.industry}</td>
                <td className="px-4 py-3 text-text-mid">{p.location ?? '—'}</td>
                <td className="px-4 py-3 text-text-mid">{p.year ?? '—'}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Link href={`/projects/${p.id}/edit`} className="btn-ghost px-2 py-1.5"><Pencil className="h-4 w-4" /></Link>
                    <button onClick={() => remove(p.id)} className="btn-danger px-2 py-1.5"><Trash2 className="h-4 w-4" /></button>
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
