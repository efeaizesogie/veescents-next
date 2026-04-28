"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Send, MapPin, Phone, Mail } from "lucide-react";

const InstagramIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
  </svg>
);

const TiktokIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

const INSTAGRAM_IMAGES = [
  "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=300&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=300&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=300&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1563170351-be82bc888aa4?q=80&w=300&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1587017539504-67cfbddac569?q=80&w=300&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=300&auto=format&fit=crop",
];

const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "All Products", href: "/store" },
  { label: "New Arrivals", href: "/store?sort=newest" },
  { label: "Best Sellers", href: "/store?sort=rating" },
  { label: "Women", href: "/store?cat=women" },
  { label: "Men", href: "/store?cat=men" },
  { label: "Unisex", href: "/store?cat=unisex" },
];

const INFO_LINKS = [
  { label: "About Us", href: "/#about" },
  { label: "Contact Us", href: "/#contact" },
  { label: "FAQ", href: "/#faq" },
  { label: "Fragrance Guide", href: "/#guide" },
  { label: "Delivery Information", href: "/#delivery" },
  { label: "Return Policy", href: "/#returns" },
  { label: "Privacy Policy", href: "/#privacy" },
];

const SOCIALS = [
  { Icon: InstagramIcon, href: "https://instagram.com", label: "Instagram" },
  { Icon: TiktokIcon, href: "https://tiktok.com", label: "TikTok" },
];

const SECTION_TITLE =
  "text-xs font-bold uppercase tracking-[0.2em] text-accent-dark mb-6";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="bg-cream-100 border-t border-gray-200">
      {/* Brand strip */}
      <div className="border-b border-gray-200">
        <div className="container mx-auto px-6 py-6 flex flex-wrap justify-center md:justify-between items-center gap-6 opacity-50 grayscale">
          {["CHANEL", "DIOR", "TOM FORD", "VERSACE", "ARMANI"].map((brand) => (
            <span
              key={brand}
              className="text-lg font-serif font-bold tracking-widest uppercase"
            >
              {brand}
            </span>
          ))}
        </div>
      </div>

      {/* Main footer grid */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Col 1 — About + Newsletter + Socials */}
          <div>
            <Link href="/" className="block mb-4">
              <Image
                src="/logo.png"
                alt="Veescents"
                width={150}
                height={50}
                className="h-18 w-auto object-contain"
              />
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed mb-8">
              Veescents is a Nigerian luxury fragrance boutique curating the
              world&apos;s finest perfumes. We believe scent is the most
              intimate form of self-expression — find yours.
            </p>

            <p className={SECTION_TITLE}>Subscribe to Newsletter</p>
            {subscribed ? (
              <p className="text-sm text-accent-gold font-medium">
                Thank you for subscribing! ✦
              </p>
            ) : (
              <form
                onSubmit={handleSubscribe}
                className="flex border border-gray-300 focus-within:border-accent-dark transition-colors"
              >
                <div className="flex items-center pl-3 text-gray-400">
                  <Mail size={14} />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 bg-transparent px-3 py-3 text-xs text-accent-dark placeholder-gray-400 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-4 bg-accent-dark text-white hover:bg-accent-gold transition-colors"
                >
                  <Send size={14} />
                </button>
              </form>
            )}

            <div className="mt-8">
              <p className={SECTION_TITLE}>Connect</p>
              <div className="flex gap-3">
                {SOCIALS.map(({ Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-9 h-9 border border-gray-300 flex items-center justify-center text-gray-400 hover:border-accent-gold hover:text-accent-gold transition-all"
                  >
                    <Icon />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Col 2 — Quick Links */}
          <div>
            <p className={SECTION_TITLE}>Quick Links</p>
            <ul className="space-y-3">
              {QUICK_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-gray-500 hover:text-accent-gold transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-3 h-px bg-gray-300 group-hover:bg-accent-gold group-hover:w-4 transition-all" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Information + Contact */}
          <div>
            <p className={SECTION_TITLE}>Information</p>
            <ul className="space-y-3 mb-10">
              {INFO_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-gray-500 hover:text-accent-gold transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-3 h-px bg-gray-300 group-hover:bg-accent-gold group-hover:w-4 transition-all" />

                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            <p className={SECTION_TITLE}>Contact</p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-gray-500">
                <MapPin
                  size={14}
                  className="mt-0.5 text-accent-gold flex-shrink-0"
                />
                Edo, Nigeria
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-500">
                <Phone size={14} className="text-accent-gold flex-shrink-0" />
                +234 802 847 9738
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-500">
                <Mail size={14} className="text-accent-gold flex-shrink-0" />
                osagieosarumen2021@gmail.com
              </li>
            </ul>
          </div>

          {/* Col 4 — Instagram Feed */}
          <div>
            <p className={SECTION_TITLE}>Instagram</p>
            <div className="grid grid-cols-3 gap-1.5 mb-4">
              {INSTAGRAM_IMAGES.map((src, i) => (
                <a
                  key={i}
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative aspect-square bg-gray-100 overflow-hidden group"
                >
                  <Image
                    src={src}
                    alt={`Instagram post ${i + 1}`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="80px"
                  />
                  <div className="absolute inset-0 bg-accent-gold/0 group-hover:bg-accent-gold/20 transition-colors flex items-center justify-center">
                    <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <InstagramIcon />
                    </span>
                  </div>
                </a>
              ))}
            </div>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs uppercase tracking-widest font-bold text-gray-400 hover:text-accent-gold transition-colors flex items-center gap-2"
            >
              <InstagramIcon /> @veescents
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-200">
        <div className="container mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} Veescents. All Rights Reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="/#privacy"
              className="hover:text-accent-gold transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/#terms"
              className="hover:text-accent-gold transition-colors"
            >
              Terms & Conditions
            </Link>
            <Link
              href="/#returns"
              className="hover:text-accent-gold transition-colors"
            >
              Return Policy
            </Link>
          </div>
          <div className="flex items-center gap-2">
            {["Visa", "Mastercard", "Verve"].map((card) => (
              <span
                key={card}
                className="px-2 py-1 border border-gray-200 rounded text-[10px] font-bold text-gray-400"
              >
                {card}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
