'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { NewsPost } from '@pa/types';
import { adminApi } from '@/lib/api';

interface Draft {
  titleUz: string;
  titleRu: string;
  titleEn: string;
  slug: string;
  bodyUz: string;
  bodyRu: string;
  bodyEn: string;
  thumbnail: string;
  category: string;
  isPublished: boolean;
}

const empty: Draft = {
  titleUz: '', titleRu: '', titleEn: '', slug: '', bodyUz: '', bodyRu: '', bodyEn: '',
  thumbnail: '', category: 'Yangilik', isPublished: false,
};

export function NewsForm({ newsId }: { newsId?: number }) {
  const router = useRouter();
  const [draft, setDraft] = useState<Draft>(empty);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!newsId) return;
    adminApi.get<NewsPost>(`/admin/news/${newsId}`).then((n) =>
      setDraft({
        titleUz: n.titleUz, titleRu: n.titleRu, titleEn: n.titleEn ?? '', slug: n.slug,
        bodyUz: n.bodyUz, bodyRu: n.bodyRu, bodyEn: n.bodyEn ?? '', thumbnail: n.thumbnail ?? '',
        category: n.category ?? 'Yangilik', isPublished: n.isPublished,
      }),
    );
  }, [newsId]);

  function set<K extends keyof Draft>(k: K, v: Draft[K]) { setDraft((d) => ({ ...d, [k]: v })); }

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const { url } = await adminApi.upload(file);
    set('thumbnail', url);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...draft,
      slug: draft.slug || undefined,
      thumbnail: draft.thumbnail || null,
      titleEn: draft.titleEn || null,
      bodyEn: draft.bodyEn || null,
    };
    try {
      if (newsId) await adminApi.put(`/admin/news/${newsId}`, payload);
      else await adminApi.post('/admin/news', payload);
      router.push('/news');
    } catch {
      alert('Saqlashda xatolik');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-3xl space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className="label">Sarlavha (UZ) *</label><input required className="input" value={draft.titleUz} onChange={(e) => set('titleUz', e.target.value)} /></div>
        <div><label className="label">Sarlavha (RU) *</label><input required className="input" value={draft.titleRu} onChange={(e) => set('titleRu', e.target.value)} /></div>
        <div className="sm:col-span-2"><label className="label">Title (EN)</label><input className="input" value={draft.titleEn} onChange={(e) => set('titleEn', e.target.value)} /></div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className="label">Slug</label><input className="input" value={draft.slug} onChange={(e) => set('slug', e.target.value)} /></div>
        <div>
          <label className="label">Kategoriya</label>
          <select className="input" value={draft.category} onChange={(e) => set('category', e.target.value)}>
            <option>Yangilik</option><option>Texnik maqola</option><option>Loyiha</option>
          </select>
        </div>
      </div>
      <div><label className="label">Matn (UZ) *</label><textarea required rows={6} className="input font-sans" value={draft.bodyUz} onChange={(e) => set('bodyUz', e.target.value)} /></div>
      <div><label className="label">Matn (RU) *</label><textarea required rows={6} className="input font-sans" value={draft.bodyRu} onChange={(e) => set('bodyRu', e.target.value)} /></div>
      <div><label className="label">Body (EN)</label><textarea rows={6} className="input font-sans" value={draft.bodyEn} onChange={(e) => set('bodyEn', e.target.value)} /></div>
      <div>
        <label className="label">Rasm</label>
        <div className="flex items-center gap-3">
          <input className="input" placeholder="URL yoki yuklang" value={draft.thumbnail} onChange={(e) => set('thumbnail', e.target.value)} />
          <label className="btn-ghost cursor-pointer"><input type="file" accept="image/*" className="hidden" onChange={onUpload} />Yuklash</label>
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={draft.isPublished} onChange={(e) => set('isPublished', e.target.checked)} /> Chop etilsin
      </label>
      <div className="flex gap-3">
        <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">{saving ? 'Saqlanmoqda...' : 'Saqlash'}</button>
        <button type="button" onClick={() => router.push('/news')} className="btn-ghost">Bekor qilish</button>
      </div>
    </form>
  );
}
