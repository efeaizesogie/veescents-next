"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, Tag, LogOut } from "lucide-react";
import { UserButton } from "@clerk/nextjs";

const NAV = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Categories", href: "/admin/categories", icon: Tag },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-cream-50 flex">
      <aside className="w-64 bg-accent-dark text-white flex flex-col fixed h-full z-40">
        <div className="px-6 py-8 border-b border-white/10">
          <Link
            href="/"
            className="font-serif text-2xl font-bold text-accent-gold"
          >
            Veescents
          </Link>
          <p className="text-xs text-white/40 mt-1 uppercase tracking-widest">
            Admin Panel
          </p>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {NAV.map(({ label, href, icon: Icon }) => {
            const active =
              pathname === href ||
              (href !== "/admin" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-4 py-3 rounded-sm text-sm font-medium transition-all ${
                  active
                    ? "bg-accent-gold text-white"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="px-6 py-6 border-t border-white/10 flex items-center justify-between">
          <UserButton />
          <Link
            href="/"
            className="flex items-center gap-2 text-xs text-white/40 hover:text-white transition-colors"
          >
            <LogOut size={14} />
            Back to site
          </Link>
        </div>
      </aside>

      <main className="ml-64 flex-1 p-10 min-h-screen">{children}</main>
    </div>
  );
}
