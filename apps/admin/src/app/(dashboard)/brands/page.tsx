'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import type { Brand } from '@pa/types';
import { adminApi } from '@/lib/api';

interface Draft {
  id?: number;
  name: string;
  country: string;
  website: string;
  logo: string;
}
const emptyDraft: Draft = { name: '', country: '', website: '', logo: '' };

export default function BrandsPage() {
  const [items, setItems] = useState<Brand[]>([]);
  const [draft, setDraft] = useState<Draft>(emptyDraft);

  const load = () => adminApi.get<Brand[]>('/admin/brands').then(setItems);
  useEffect(() => { load(); }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      name: draft.name,
      country: draft.country || null,
      website: draft.website || null,
      logo: draft.logo || null,
    };
    if (draft.id) await adminApi.put(`/admin/brands/${draft.id}`, payload);
    else await adminApi.post('/admin/brands', payload);
    setDraft(emptyDraft);
    load();
  }

  async function remove(id: number) {
    if (!confirm("O'chirilsinmi?")) return;
    try { await adminApi.del(`/admin/brands/${id}`); load(); }
    catch { alert("O'chirib bo'lmadi"); }
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-text-dark">Brendlar</h1>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card overflow-hidden lg:col-span-2">
          <table className="w-full text-sm">
            <thead className="bg-neutralbg text-left text-text-mid">
              <tr>
                <th className="px-4 py-3 font-medium">Nomi</th>
                <th className="px-4 py-3 font-medium">Mamlakat</th>
                <th className="px-4 py-3 font-medium text-right">Amallar</th>
              </tr>
            </thead>
            <tbody>
              {items.map((b) => (
                <tr key={b.id} className="border-t border-blue-bg">
                  <td className="px-4 py-3 font-medium text-text-dark">{b.name}</td>
                  <td className="px-4 py-3 text-text-mid">{b.country ?? '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setDraft({ id: b.id, name: b.name, country: b.country ?? '', website: b.website ?? '', logo: b.logo ?? '' })} className="btn-ghost px-2 py-1.5"><Pencil className="h-4 w-4" /></button>
                      <button onClick={() => remove(b.id)} className="btn-danger px-2 py-1.5"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <form onSubmit={save} className="card h-fit space-y-3 p-5">
          <h2 className="font-semibold text-text-dark">{draft.id ? 'Tahrirlash' : 'Yangi brend'}</h2>
          <div><label className="label">Nomi</label><input required className="input" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} /></div>
          <div><label className="label">Mamlakat</label><input className="input" value={draft.country} onChange={(e) => setDraft({ ...draft, country: e.target.value })} /></div>
          <div><label className="label">Veb-sayt</label><input className="input" value={draft.website} onChange={(e) => setDraft({ ...draft, website: e.target.value })} /></div>
          <div><label className="label">Logo URL</label><input className="input" value={draft.logo} onChange={(e) => setDraft({ ...draft, logo: e.target.value })} /></div>
          <div className="flex gap-2">
            <button type="submit" className="btn-primary"><Plus className="h-4 w-4" /> Saqlash</button>
            {draft.id && <button type="button" onClick={() => setDraft(emptyDraft)} className="btn-ghost">Bekor</button>}
          </div>
        </form>
      </div>
    </div>
  );
}
