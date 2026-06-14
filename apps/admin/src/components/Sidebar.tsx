'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Tags,
  Inbox,
  Newspaper,
  Briefcase,
  LogOut,
} from 'lucide-react';
import { clearToken } from '@/lib/api';

const LINKS = [
  { href: '/dashboard', label: 'Boshqaruv paneli', icon: LayoutDashboard },
  { href: '/products', label: 'Mahsulotlar', icon: Package },
  { href: '/categories', label: 'Kategoriyalar', icon: FolderTree },
  { href: '/brands', label: 'Brendlar', icon: Tags },
  { href: '/inquiries', label: "So'rovlar", icon: Inbox },
  { href: '/news', label: 'Yangiliklar', icon: Newspaper },
  { href: '/projects', label: 'Loyihalar', icon: Briefcase },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  function logout() {
    clearToken();
    router.replace('/login');
  }

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-blue-bg bg-white">
      <div className="flex items-center gap-2 px-5 py-5">
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-blue-dark font-bold text-white">
          PA
        </span>
        <span className="font-bold text-text-dark">Admin</span>
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {LINKS.map((link) => {
          const active = pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active ? 'bg-blue-dark text-white' : 'text-text-mid hover:bg-blue-bg'
              }`}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>
      <button
        onClick={logout}
        className="m-3 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
      >
        <LogOut className="h-4 w-4" />
        Chiqish
      </button>
    </aside>
  );
}
