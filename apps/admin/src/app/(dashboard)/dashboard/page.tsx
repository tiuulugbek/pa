'use client';

import { useEffect, useState } from 'react';
import { Package, FolderTree, Tags, Inbox } from 'lucide-react';
import type { DashboardStats } from '@pa/types';
import { adminApi } from '@/lib/api';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    adminApi
      .get<DashboardStats>('/admin/dashboard')
      .then(setStats)
      .catch(() => setError('Maʼlumotlarni yuklab boʻlmadi'));
  }, []);

  if (error) return <p className="text-red-600">{error}</p>;
  if (!stats) return <p className="text-text-mid">Yuklanmoqda...</p>;

  const cards = [
    { label: 'Mahsulotlar', value: stats.totalProducts, icon: Package },
    { label: 'Kategoriyalar', value: stats.totalCategories, icon: FolderTree },
    { label: 'Brendlar', value: stats.totalBrands, icon: Tags },
    { label: "So'rovlar", value: stats.inquiries.total, icon: Inbox },
  ];

  const maxMonthly = Math.max(1, ...stats.monthly.map((m) => m.count));

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-text-dark">Boshqaruv paneli</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="card flex items-center gap-4 p-5">
            <span className="grid h-12 w-12 place-items-center rounded-lg bg-blue-bg text-blue-dark">
              <c.icon className="h-6 w-6" />
            </span>
            <div>
              <div className="text-2xl font-bold text-text-dark">{c.value}</div>
              <div className="text-sm text-text-mid">{c.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Inquiry status */}
        <div className="card p-5">
          <h2 className="mb-4 font-semibold text-text-dark">So'rovlar holati</h2>
          <ul className="space-y-3 text-sm">
            <li className="flex justify-between">
              <span className="text-text-mid">Yangi (NEW)</span>
              <span className="font-semibold text-blue-dark">{stats.inquiries.NEW}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-text-mid">Ko'rilgan (SEEN)</span>
              <span className="font-semibold text-amber-600">{stats.inquiries.SEEN}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-text-mid">Javob berilgan (REPLIED)</span>
              <span className="font-semibold text-green-600">{stats.inquiries.REPLIED}</span>
            </li>
          </ul>
        </div>

        {/* Monthly chart */}
        <div className="card p-5 lg:col-span-2">
          <h2 className="mb-4 font-semibold text-text-dark">Oylik so'rovlar</h2>
          <div className="flex h-48 items-end gap-3">
            {stats.monthly.map((m) => (
              <div key={m.month} className="flex flex-1 flex-col items-center gap-2">
                <div
                  className="w-full rounded-t bg-blue-mid transition-all"
                  style={{ height: `${(m.count / maxMonthly) * 100}%`, minHeight: '4px' }}
                  title={`${m.count}`}
                />
                <span className="text-xs text-text-mid">{m.month.slice(5)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
