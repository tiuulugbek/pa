'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, Trash2 } from 'lucide-react';
import type { Project } from '@pa/types';
import { INDUSTRY_META } from '@pa/ui';
import { adminApi, API_URL } from '@/lib/api';

interface Draft {
  titleUz: string;
  titleRu: string;
  titleEn: string;
  slug: string;
  descUz: string;
  descRu: string;
  descEn: string;
  industry: string;
  location: string;
  year: number | '';
  images: string[];
  isPublished: boolean;
}

const empty: Draft = {
  titleUz: '', titleRu: '', titleEn: '', slug: '', descUz: '', descRu: '', descEn: '',
  industry: 'oil_gas', location: '', year: new Date().getFullYear(),
  images: [], isPublished: true,
};

export function ProjectForm({ projectId }: { projectId?: number }) {
  const router = useRouter();
  const [draft, setDraft] = useState<Draft>(empty);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!projectId) return;
    adminApi.get<Project>(`/admin/projects/${projectId}`).then((p) =>
      setDraft({
        titleUz: p.titleUz, titleRu: p.titleRu, titleEn: p.titleEn ?? '', slug: p.slug,
        descUz: p.descUz, descRu: p.descRu, descEn: p.descEn ?? '', industry: p.industry,
        location: p.location ?? '', year: p.year ?? '', images: p.images ?? [],
        isPublished: p.isPublished,
      }),
    );
  }, [projectId]);

  function set<K extends keyof Draft>(k: K, v: Draft[K]) { setDraft((d) => ({ ...d, [k]: v })); }

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const { url } = await adminApi.upload(file);
    set('images', [...draft.images, url]);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...draft,
      slug: draft.slug || undefined,
      location: draft.location || null,
      titleEn: draft.titleEn || null,
      descEn: draft.descEn || null,
      year: draft.year === '' ? null : Number(draft.year),
    };
    try {
      if (projectId) await adminApi.put(`/admin/projects/${projectId}`, payload);
      else await adminApi.post('/admin/projects', payload);
      router.push('/projects');
    } catch {
      alert('Saqlashda xatolik');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-3xl space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className="label">Nomi (UZ) *</label><input required className="input" value={draft.titleUz} onChange={(e) => set('titleUz', e.target.value)} /></div>
        <div><label className="label">Nomi (RU) *</label><input required className="input" value={draft.titleRu} onChange={(e) => set('titleRu', e.target.value)} /></div>
        <div className="sm:col-span-2"><label className="label">Title (EN)</label><input className="input" value={draft.titleEn} onChange={(e) => set('titleEn', e.target.value)} /></div>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div><label className="label">Slug</label><input className="input" value={draft.slug} onChange={(e) => set('slug', e.target.value)} /></div>
        <div>
          <label className="label">Soha</label>
          <select className="input" value={draft.industry} onChange={(e) => set('industry', e.target.value)}>
            {INDUSTRY_META.map((i) => <option key={i.key} value={i.key}>{i.uz}</option>)}
          </select>
        </div>
        <div><label className="label">Yil</label><input type="number" className="input" value={draft.year} onChange={(e) => set('year', e.target.value ? Number(e.target.value) : '')} /></div>
      </div>
      <div><label className="label">Joylashuv</label><input className="input" value={draft.location} onChange={(e) => set('location', e.target.value)} /></div>
      <div><label className="label">Tavsif (UZ) *</label><textarea required rows={4} className="input" value={draft.descUz} onChange={(e) => set('descUz', e.target.value)} /></div>
      <div><label className="label">Tavsif (RU) *</label><textarea required rows={4} className="input" value={draft.descRu} onChange={(e) => set('descRu', e.target.value)} /></div>
      <div><label className="label">Description (EN)</label><textarea rows={4} className="input" value={draft.descEn} onChange={(e) => set('descEn', e.target.value)} /></div>
      <div>
        <label className="label">Rasmlar</label>
        <div className="flex flex-wrap items-center gap-3">
          {draft.images.map((img, i) => (
            <div key={i} className="relative h-20 w-20 overflow-hidden rounded-lg border border-blue-bg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.startsWith('/uploads') ? `${API_URL}${img}` : img} alt="" className="h-full w-full object-cover" />
              <button type="button" onClick={() => set('images', draft.images.filter((_, idx) => idx !== i))} className="absolute right-0 top-0 bg-red-600 px-1 text-xs text-white">×</button>
            </div>
          ))}
          <label className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-blue-mid text-blue-mid">
            <Upload className="h-5 w-5" />
            <input type="file" accept="image/*" className="hidden" onChange={onUpload} />
          </label>
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={draft.isPublished} onChange={(e) => set('isPublished', e.target.checked)} /> Chop etilsin
      </label>
      <div className="flex gap-3">
        <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">{saving ? 'Saqlanmoqda...' : 'Saqlash'}</button>
        <button type="button" onClick={() => router.push('/projects')} className="btn-ghost">Bekor qilish</button>
      </div>
    </form>
  );
}
