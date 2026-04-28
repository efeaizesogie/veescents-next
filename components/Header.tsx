"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Search,
  Heart,
  ShoppingCart,
  Menu,
  X,
  ChevronDown,
  LayoutDashboard,
} from "lucide-react";
import { useStore } from "@/context/StoreContext";
import SearchOverlay from "./SearchOverlay";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";

const NAV_LINKS = [
  { label: "Home", href: "/", hasDropdown: false, dropdownItems: [] },
  {
    label: "Categories",
    href: "/categories",
    hasDropdown: false,
    dropdownItems: [],
  },
  {
    label: "Collections",
    href: "/collections",
    hasDropdown: true,
    dropdownItems: [
      { label: "Original Designer Perfume", href: "/store?collection=original-designer-perfume" },
      { label: "Arabian Luxury Perfume", href: "/store?collection=arabian-luxury-perfume" },
      { label: "Arabian Perfume", href: "/store?collection=arabian-perfume" },
      { label: "Perfume Oil", href: "/store?collection=perfume-oil" },
      { label: "Body Spray", href: "/store?collection=body-spray" },
      { label: "Body Mist", href: "/store?collection=body-mist" },
      { label: "Perfume Gift Sets", href: "/store?collection=perfume-gift-set" },
      { label: "Diffuser", href: "/store?collection=diffuser" },
      { label: "Kiddies", href: "/store?collection=kiddies" },
      { label: "Combos", href: "/store?collection=combo" },
    ],
  },
  {
    label: "Contact Us",
    href: "/#contact",
    hasDropdown: false,
    dropdownItems: [],
  },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [sectionItems, setSectionItems] = useState<{ label: string; href: string }[]>([]);
  const { cartCount, wishlist, setIsCartOpen, setIsWishlistOpen } = useStore();
  const pathname = usePathname();
  const { user } = useUser();
  const adminIds = (process.env.NEXT_PUBLIC_ADMIN_USER_IDS || "")
    .split(",")
    .map((id) => id.trim());
  const isAdmin = user && adminIds.includes(user.id);

  useEffect(() => {
    fetch('/api/admin/sections')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          setSectionItems(data.map((s: { name: string; slug: string }) => ({
            label: s.name,
            href: `/sections/${s.slug}`,
          })));
        }
      });
  }, []);

  const navLinks = [
    ...NAV_LINKS.slice(0, 2),
    {
      label: "Sections",
      href: "/sections",
      hasDropdown: true,
      dropdownItems: [
        { label: "All Products", href: "/store" },
        { label: "New Arrivals", href: "/store?sort=newest" },
        { label: "Best Sellers", href: "/store?sort=best_selling" },
        ...sectionItems,
      ],
    },
    ...NAV_LINKS.slice(2),
  ];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-sm shadow-sm border-b border-accent-gold/20 py-3"
            : "bg-cream-50 py-5"
        }`}
        onMouseLeave={() => setActiveDropdown(null)}
      >
        <div className="container mx-auto px-6 flex items-center justify-between">
          <div className="w-1/4">
            <Link href="/" className="block">
              <Image
                src="/logo.png"
                alt="Veescents"
                width={150}
                height={50}
                className="h-18 w-auto object-contain"
                priority
              />
            </Link>
          </div>

          <nav className="hidden lg:flex items-center justify-center flex-1 space-x-8">
            {navLinks.map((link) => (
              <div
                key={link.label}
                className="relative group"
                onMouseEnter={() => setActiveDropdown(link.label)}
              >
                <Link
                  href={link.href}
                  className="text-accent-dark hover:text-accent-gold text-sm font-medium transition-colors flex items-center gap-1 py-2 tracking-wide"
                >
                  {link.label}
                  {link.hasDropdown && (
                    <ChevronDown
                      size={14}
                      className="text-gray-400 group-hover:text-accent-gold"
                    />
                  )}
                </Link>
                {link.hasDropdown &&
                  activeDropdown === link.label &&
                  link.dropdownItems.length > 0 && (
                    <div
                      className={`absolute top-full left-1/2 -translate-x-1/2 pt-2 animate-fade-in ${
                        link.label === "Collections" ? "w-64" : "w-52"
                      }`}
                    >
                      <div className="bg-white shadow-xl rounded-sm py-2 border-t-2 border-accent-gold">
                        {link.dropdownItems.map((item) => (
                          <Link
                            key={item.label}
                            href={item.href}
                            onClick={() => setActiveDropdown(null)}
                            className="block px-4 py-2 text-sm text-gray-600 hover:bg-cream-100 hover:text-accent-gold transition-colors"
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            ))}
          </nav>

          <div className="w-1/4 flex items-center justify-end space-x-5 text-gray-600">
            <button
              className="hover:text-accent-gold transition-colors"
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search"
            >
              <Search size={20} />
            </button>
            <button
              className="hover:text-accent-gold transition-colors hidden sm:block relative"
              onClick={() => setIsWishlistOpen(true)}
              aria-label="Wishlist"
            >
              <Heart size={20} />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 h-2 w-2 bg-accent-gold rounded-full" />
              )}
            </button>
            <button
              className="hover:text-accent-gold transition-colors relative"
              onClick={() => setIsCartOpen(true)}
              aria-label="Cart"
            >
              <ShoppingCart size={20} />
              <span
                className={`absolute -top-2 -right-2 bg-accent-gold text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center transition-transform font-bold ${
                  cartCount > 0 ? "scale-100" : "scale-0"
                }`}
              >
                {cartCount}
              </span>
            </button>
            {!user && (
              <SignInButton mode="modal">
                <button className="hover:text-accent-gold transition-colors hidden sm:flex items-center gap-1 text-xs font-medium tracking-wide">
                  Sign In
                </button>
              </SignInButton>
            )}
            {user && (
              <>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="hover:text-accent-gold transition-colors hidden sm:flex items-center gap-1"
                  >
                    <LayoutDashboard size={18} />
                    <span className="text-xs font-medium">Admin</span>
                  </Link>
                )}
                <UserButton />
              </>
            )}
            <button
              className="lg:hidden hover:text-accent-gold"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-white shadow-lg border-t border-accent-gold/20 py-4 px-6 flex flex-col space-y-2 max-h-[80vh] overflow-y-auto">
            {navLinks.map((link) => (
              <div key={link.label}>
                <Link
                  href={link.href}
                  className="block text-accent-dark hover:text-accent-gold font-medium py-2 border-b border-gray-50"
                >
                  {link.label}
                </Link>
                {link.dropdownItems.length > 0 && (
                  <div className="pl-4 py-2 space-y-2 bg-cream-100">
                    {link.dropdownItems.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        className="block text-sm text-gray-500 hover:text-accent-gold py-0.5"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {!user && (
                  <SignInButton mode="modal">
                    <button className="text-sm font-medium text-accent-dark hover:text-accent-gold transition-colors">
                      Sign In
                    </button>
                  </SignInButton>
                )}
                {user && isAdmin && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-1 text-sm font-medium text-accent-dark hover:text-accent-gold transition-colors"
                  >
                    <LayoutDashboard size={16} /> Admin Panel
                  </Link>
                )}
              </div>
              {user && <UserButton />}
            </div>
          </div>
        )}
      </header>

      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}
