'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import type { Category } from '@pa/types';
import { adminApi } from '@/lib/api';

interface Draft {
  id?: number;
  nameUz: string;
  nameRu: string;
  nameEn: string;
  slug: string;
  parentId: number | '';
  order: number;
}

const emptyDraft: Draft = { nameUz: '', nameRu: '', nameEn: '', slug: '', parentId: '', order: 0 };

export default function CategoriesPage() {
  const [items, setItems] = useState<Category[]>([]);
  const [draft, setDraft] = useState<Draft>(emptyDraft);

  const load = () => adminApi.get<Category[]>('/admin/categories').then(setItems);
  useEffect(() => { load(); }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      nameUz: draft.nameUz,
      nameRu: draft.nameRu,
      nameEn: draft.nameEn || null,
      slug: draft.slug || undefined,
      parentId: draft.parentId === '' ? null : Number(draft.parentId),
      order: Number(draft.order),
    };
    if (draft.id) await adminApi.put(`/admin/categories/${draft.id}`, payload);
    else await adminApi.post('/admin/categories', payload);
    setDraft(emptyDraft);
    load();
  }

  async function remove(id: number) {
    if (!confirm("O'chirilsinmi?")) return;
    try {
      await adminApi.del(`/admin/categories/${id}`);
      load();
    } catch {
      alert("O'chirib bo'lmadi (mahsulotlar bog'langan bo'lishi mumkin)");
    }
  }

  const parents = items.filter((c) => c.parentId === null);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-text-dark">Kategoriyalar</h1>
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Tree */}
        <div className="card overflow-hidden lg:col-span-2">
          <table className="w-full text-sm">
            <thead className="bg-neutralbg text-left text-text-mid">
              <tr>
                <th className="px-4 py-3 font-medium">Nomi (UZ)</th>
                <th className="px-4 py-3 font-medium">Slug</th>
                <th className="px-4 py-3 font-medium text-right">Amallar</th>
              </tr>
            </thead>
            <tbody>
              {parents.map((p) => (
                <CategoryRows key={p.id} parent={p} all={items} onEdit={(c) => setDraft({ id: c.id, nameUz: c.nameUz, nameRu: c.nameRu, nameEn: c.nameEn ?? '', slug: c.slug, parentId: c.parentId ?? '', order: c.order })} onRemove={remove} />
              ))}
            </tbody>
          </table>
        </div>

        {/* Form */}
        <form onSubmit={save} className="card h-fit space-y-3 p-5">
          <h2 className="font-semibold text-text-dark">{draft.id ? 'Tahrirlash' : 'Yangi kategoriya'}</h2>
          <div><label className="label">Nomi (UZ)</label><input required className="input" value={draft.nameUz} onChange={(e) => setDraft({ ...draft, nameUz: e.target.value })} /></div>
          <div><label className="label">Nomi (RU)</label><input required className="input" value={draft.nameRu} onChange={(e) => setDraft({ ...draft, nameRu: e.target.value })} /></div>
          <div><label className="label">Name (EN)</label><input className="input" value={draft.nameEn} onChange={(e) => setDraft({ ...draft, nameEn: e.target.value })} /></div>
          <div><label className="label">Slug</label><input className="input" value={draft.slug} onChange={(e) => setDraft({ ...draft, slug: e.target.value })} /></div>
          <div>
            <label className="label">Ota kategoriya</label>
            <select className="input" value={draft.parentId} onChange={(e) => setDraft({ ...draft, parentId: e.target.value ? Number(e.target.value) : '' })}>
              <option value="">Yo'q (asosiy)</option>
              {parents.map((p) => <option key={p.id} value={p.id}>{p.nameUz}</option>)}
            </select>
          </div>
          <div><label className="label">Tartib</label><input type="number" className="input" value={draft.order} onChange={(e) => setDraft({ ...draft, order: Number(e.target.value) })} /></div>
          <div className="flex gap-2">
            <button type="submit" className="btn-primary"><Plus className="h-4 w-4" /> Saqlash</button>
            {draft.id && <button type="button" onClick={() => setDraft(emptyDraft)} className="btn-ghost">Bekor</button>}
          </div>
        </form>
      </div>
    </div>
  );
}

function CategoryRows({ parent, all, onEdit, onRemove }: {
  parent: Category;
  all: Category[];
  onEdit: (c: Category) => void;
  onRemove: (id: number) => void;
}) {
  const children = all.filter((c) => c.parentId === parent.id);
  return (
    <>
      <tr className="border-t border-blue-bg">
        <td className="px-4 py-3 font-semibold text-text-dark">{parent.nameUz}</td>
        <td className="px-4 py-3 font-mono text-xs text-text-mid">{parent.slug}</td>
        <td className="px-4 py-3"><Actions onEdit={() => onEdit(parent)} onRemove={() => onRemove(parent.id)} /></td>
      </tr>
      {children.map((c) => (
        <tr key={c.id} className="border-t border-blue-bg/50">
          <td className="px-4 py-2 pl-8 text-text-mid">— {c.nameUz}</td>
          <td className="px-4 py-2 font-mono text-xs text-text-mid">{c.slug}</td>
          <td className="px-4 py-2"><Actions onEdit={() => onEdit(c)} onRemove={() => onRemove(c.id)} /></td>
        </tr>
      ))}
    </>
  );
}

function Actions({ onEdit, onRemove }: { onEdit: () => void; onRemove: () => void }) {
  return (
    <div className="flex justify-end gap-2">
      <button onClick={onEdit} className="btn-ghost px-2 py-1.5"><Pencil className="h-4 w-4" /></button>
      <button onClick={onRemove} className="btn-danger px-2 py-1.5"><Trash2 className="h-4 w-4" /></button>
    </div>
  );
}
