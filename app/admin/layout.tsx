'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, Layers, Settings, LogOut, Tag, Menu, X, LayoutGrid } from 'lucide-react';
import { UserButton } from '@clerk/nextjs';

const NAV = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Products', href: '/admin/products', icon: Package },
  { label: 'Collections', href: '/admin/collections', icon: Layers },
  { label: 'Categories', href: '/admin/categories', icon: Tag },
  { label: 'Sections', href: '/admin/sections', icon: LayoutGrid },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const SidebarContent = () => (
    <>
      <div className="px-6 py-8 border-b border-white/10">
        <Link href="/" className="font-serif text-2xl font-bold text-accent-gold block">Veescents</Link>
        <p className="text-xs text-white/40 mt-1 uppercase tracking-widest">Admin Panel</p>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1">
        {NAV.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || (href !== '/admin' && pathname.startsWith(href));
          return (
            <Link key={href} href={href} onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-sm text-sm font-medium transition-all ${active ? 'bg-accent-gold text-white' : 'text-white/60 hover:text-white hover:bg-white/5'}`}>
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-6 py-6 border-t border-white/10 flex items-center justify-between">
        <UserButton />
        <Link href="/" className="flex items-center gap-2 text-xs text-white/40 hover:text-white transition-colors">
          <LogOut size={14} /> Back to site
        </Link>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-cream-50 flex">
      {/* Desktop sidebar */}
      <aside className="w-64 bg-accent-dark text-white flex-col fixed h-full z-40 hidden md:flex">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-64 bg-accent-dark text-white flex flex-col h-full z-10">
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 text-white/60 hover:text-white"
            >
              <X size={20} />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center justify-between bg-accent-dark text-white px-4 py-3 sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="text-white/80 hover:text-white">
            <Menu size={22} />
          </button>
          <span className="font-serif text-lg text-accent-gold">Admin Panel</span>
          <UserButton />
        </div>

        <main className="flex-1 p-4 md:p-10">{children}</main>
      </div>
    </div>
  );
}
