'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Upload } from 'lucide-react';
import type { Brand, Category, Product, Specification, ProductDocument } from '@pa/types';
import { INDUSTRY_META } from '@pa/ui';
import { adminApi, API_URL } from '@/lib/api';

const CERTS = ['ATEX', 'IECEx', 'GOST', 'CE', 'ISO9001'];

interface FormState {
  nameUz: string;
  nameRu: string;
  nameEn: string;
  slug: string;
  descriptionUz: string;
  descriptionRu: string;
  descriptionEn: string;
  categoryId: number | '';
  brandId: number | '';
  badge: string;
  isActive: boolean;
  isFeatured: boolean;
  images: string[];
  certificates: string[];
  industries: string[];
  specifications: Specification[];
  documents: ProductDocument[];
}

const empty: FormState = {
  nameUz: '',
  nameRu: '',
  nameEn: '',
  slug: '',
  descriptionUz: '',
  descriptionRu: '',
  descriptionEn: '',
  categoryId: '',
  brandId: '',
  badge: '',
  isActive: true,
  isFeatured: false,
  images: [],
  certificates: [],
  industries: [],
  specifications: [],
  documents: [],
};

export function ProductForm({ productId }: { productId?: number }) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(empty);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminApi.get<Category[]>('/admin/categories').then(setCategories);
    adminApi.get<Brand[]>('/admin/brands').then(setBrands);
    if (productId) {
      adminApi.get<Product>(`/admin/products/${productId}`).then((p) => {
        setForm({
          nameUz: p.nameUz,
          nameRu: p.nameRu,
          nameEn: p.nameEn ?? '',
          slug: p.slug,
          descriptionUz: p.descriptionUz ?? '',
          descriptionRu: p.descriptionRu ?? '',
          descriptionEn: p.descriptionEn ?? '',
          categoryId: p.categoryId,
          brandId: p.brandId ?? '',
          badge: p.badge ?? '',
          isActive: p.isActive,
          isFeatured: p.isFeatured,
          images: p.images ?? [],
          certificates: p.certificates ?? [],
          industries: p.industries ?? [],
          specifications: (p.specifications as Specification[]) ?? [],
          documents: (p.documents as ProductDocument[]) ?? [],
        });
      });
    }
  }, [productId]);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function toggleArray(key: 'certificates' | 'industries', value: string) {
    setForm((f) => {
      const arr = f[key];
      return { ...f, [key]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value] };
    });
  }

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const { url } = await adminApi.upload(file);
    set('images', [...form.images, url]);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      categoryId: Number(form.categoryId),
      brandId: form.brandId === '' ? null : Number(form.brandId),
      badge: form.badge || null,
      nameEn: form.nameEn || null,
      descriptionUz: form.descriptionUz || null,
      descriptionRu: form.descriptionRu || null,
      descriptionEn: form.descriptionEn || null,
    };
    try {
      if (productId) await adminApi.put(`/admin/products/${productId}`, payload);
      else await adminApi.post('/admin/products', payload);
      router.push('/products');
    } catch {
      alert('Saqlashda xatolik');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-3xl space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Nomi (UZ) *</label>
          <input required className="input" value={form.nameUz} onChange={(e) => set('nameUz', e.target.value)} />
        </div>
        <div>
          <label className="label">Nomi (RU) *</label>
          <input required className="input" value={form.nameRu} onChange={(e) => set('nameRu', e.target.value)} />
        </div>
        <div>
          <label className="label">Name (EN)</label>
          <input className="input" value={form.nameEn} onChange={(e) => set('nameEn', e.target.value)} />
        </div>
      </div>

      <div>
        <label className="label">Slug (bo'sh qoldirilsa avtomatik)</label>
        <input className="input" value={form.slug} onChange={(e) => set('slug', e.target.value)} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Tavsif (UZ)</label>
          <textarea rows={3} className="input" value={form.descriptionUz} onChange={(e) => set('descriptionUz', e.target.value)} />
        </div>
        <div>
          <label className="label">Tavsif (RU)</label>
          <textarea rows={3} className="input" value={form.descriptionRu} onChange={(e) => set('descriptionRu', e.target.value)} />
        </div>
        <div className="sm:col-span-2">
          <label className="label">Description (EN)</label>
          <textarea rows={3} className="input" value={form.descriptionEn} onChange={(e) => set('descriptionEn', e.target.value)} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="label">Kategoriya *</label>
          <select required className="input" value={form.categoryId} onChange={(e) => set('categoryId', e.target.value ? Number(e.target.value) : '')}>
            <option value="">Tanlang</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.parentId ? '— ' : ''}{c.nameUz}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Brend</label>
          <select className="input" value={form.brandId} onChange={(e) => set('brandId', e.target.value ? Number(e.target.value) : '')}>
            <option value="">Yo'q</option>
            {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Badge</label>
          <input className="input" value={form.badge} onChange={(e) => set('badge', e.target.value)} placeholder="Yangi / Sertifikatlangan" />
        </div>
      </div>

      {/* Images */}
      <div>
        <label className="label">Rasmlar</label>
        <div className="flex flex-wrap items-center gap-3">
          {form.images.map((img, i) => (
            <div key={i} className="relative h-20 w-20 overflow-hidden rounded-lg border border-blue-bg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.startsWith('/uploads') ? `${API_URL}${img}` : img} alt="" className="h-full w-full object-cover" />
              <button type="button" onClick={() => set('images', form.images.filter((_, idx) => idx !== i))} className="absolute right-0 top-0 bg-red-600 px-1 text-xs text-white">×</button>
            </div>
          ))}
          <label className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-blue-mid text-blue-mid">
            <Upload className="h-5 w-5" />
            <input type="file" accept="image/*" className="hidden" onChange={onUpload} />
          </label>
        </div>
      </div>

      {/* Certificates */}
      <div>
        <label className="label">Sertifikatlar</label>
        <div className="flex flex-wrap gap-3">
          {CERTS.map((c) => (
            <label key={c} className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.certificates.includes(c)} onChange={() => toggleArray('certificates', c)} />
              {c}
            </label>
          ))}
        </div>
      </div>

      {/* Industries */}
      <div>
        <label className="label">Sohalar</label>
        <div className="flex flex-wrap gap-3">
          {INDUSTRY_META.map((ind) => (
            <label key={ind.key} className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.industries.includes(ind.key)} onChange={() => toggleArray('industries', ind.key)} />
              {ind.uz}
            </label>
          ))}
        </div>
      </div>

      {/* Specifications */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="label mb-0">Texnik xususiyatlar</label>
          <button type="button" onClick={() => set('specifications', [...form.specifications, { label: '', value: '' }])} className="btn-ghost px-2 py-1 text-xs">
            <Plus className="h-3 w-3" /> Qator
          </button>
        </div>
        <div className="space-y-2">
          {form.specifications.map((spec, i) => (
            <div key={i} className="flex gap-2">
              <input className="input" placeholder="Nomi" value={spec.label} onChange={(e) => {
                const next = [...form.specifications];
                next[i] = { ...next[i], label: e.target.value };
                set('specifications', next);
              }} />
              <input className="input" placeholder="Qiymati" value={spec.value} onChange={(e) => {
                const next = [...form.specifications];
                next[i] = { ...next[i], value: e.target.value };
                set('specifications', next);
              }} />
              <button type="button" onClick={() => set('specifications', form.specifications.filter((_, idx) => idx !== i))} className="btn-danger px-2">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Documents */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="label mb-0">Hujjatlar</label>
          <button type="button" onClick={() => set('documents', [...form.documents, { name: '', url: '' }])} className="btn-ghost px-2 py-1 text-xs">
            <Plus className="h-3 w-3" /> Qator
          </button>
        </div>
        <div className="space-y-2">
          {form.documents.map((doc, i) => (
            <div key={i} className="flex gap-2">
              <input className="input" placeholder="Nomi" value={doc.name} onChange={(e) => {
                const next = [...form.documents];
                next[i] = { ...next[i], name: e.target.value };
                set('documents', next);
              }} />
              <input className="input" placeholder="URL" value={doc.url} onChange={(e) => {
                const next = [...form.documents];
                next[i] = { ...next[i], url: e.target.value };
                set('documents', next);
              }} />
              <button type="button" onClick={() => set('documents', form.documents.filter((_, idx) => idx !== i))} className="btn-danger px-2">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.isActive} onChange={(e) => set('isActive', e.target.checked)} /> Faol
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.isFeatured} onChange={(e) => set('isFeatured', e.target.checked)} /> Tavsiya etilgan
        </label>
      </div>

      <div className="flex gap-3">
        <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
          {saving ? 'Saqlanmoqda...' : 'Saqlash'}
        </button>
        <button type="button" onClick={() => router.push('/products')} className="btn-ghost">
          Bekor qilish
        </button>
      </div>
    </form>
  );
}
