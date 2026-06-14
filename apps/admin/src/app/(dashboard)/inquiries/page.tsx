'use client';

import { useEffect, useState } from 'react';
import { Check, Eye } from 'lucide-react';
import type { Inquiry, InquiryStatus } from '@pa/types';
import { adminApi } from '@/lib/api';

type Row = Inquiry & { product?: { nameUz: string; slug: string } | null };

const STATUS_FILTERS: { key: string; label: string }[] = [
  { key: '', label: 'Barchasi' },
  { key: 'NEW', label: 'Yangi' },
  { key: 'SEEN', label: "Ko'rilgan" },
  { key: 'REPLIED', label: 'Javob berilgan' },
];

const STATUS_STYLE: Record<InquiryStatus, string> = {
  NEW: 'bg-blue-bg text-blue-dark',
  SEEN: 'bg-amber-50 text-amber-600',
  REPLIED: 'bg-green-50 text-green-600',
};

export default function InquiriesPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [filter, setFilter] = useState('');

  const load = (status: string) =>
    adminApi.get<Row[]>(`/admin/inquiries${status ? `?status=${status}` : ''}`).then(setRows);

  useEffect(() => { load(filter); }, [filter]);

  async function setStatus(id: number, status: InquiryStatus) {
    await adminApi.patch(`/admin/inquiries/${id}/status`, { status });
    load(filter);
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-text-dark">So'rovlar</h1>

      <div className="mb-4 flex gap-2">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`rounded-full px-4 py-1.5 text-sm ${filter === f.key ? 'bg-blue-dark text-white' : 'border border-blue-bg bg-white text-text-mid'}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutralbg text-left text-text-mid">
            <tr>
              <th className="px-4 py-3 font-medium">Sana</th>
              <th className="px-4 py-3 font-medium">Mahsulot</th>
              <th className="px-4 py-3 font-medium">Kontakt</th>
              <th className="px-4 py-3 font-medium">Xabar</th>
              <th className="px-4 py-3 font-medium">Holat</th>
              <th className="px-4 py-3 font-medium text-right">Amallar</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-text-mid">So'rov yo'q</td></tr>
            ) : rows.map((r) => (
              <tr key={r.id} className="border-t border-blue-bg align-top">
                <td className="px-4 py-3 text-text-mid">{new Date(r.createdAt).toLocaleDateString('uz-UZ')}</td>
                <td className="px-4 py-3 text-text-dark">{r.product?.nameUz ?? '—'}</td>
                <td className="px-4 py-3 text-text-mid">
                  {r.telegramUsername ? `@${r.telegramUsername}` : r.name ?? '—'}
                  {r.phone && <div className="text-xs">{r.phone}</div>}
                  {r.company && <div className="text-xs">{r.company}</div>}
                </td>
                <td className="max-w-xs px-4 py-3 text-text-mid">{r.message}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs ${STATUS_STYLE[r.status]}`}>{r.status}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => setStatus(r.id, 'SEEN')} className="btn-ghost px-2 py-1.5" title="Ko'rildi"><Eye className="h-4 w-4" /></button>
                    <button onClick={() => setStatus(r.id, 'REPLIED')} className="btn-ghost px-2 py-1.5" title="Javob berildi"><Check className="h-4 w-4" /></button>
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
