import Image from 'next/image';
import Link from 'next/link';

export default function PromoCards() {
  return (
    <section className="py-16 bg-cream-50">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Niche card */}
          <div className="relative h-64 overflow-hidden group">
            <Image
              src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=1000&auto=format&fit=crop"
              alt="Niche Perfumes"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/20" />
            <div className="absolute inset-0 p-8 flex flex-col justify-center">
              <span className="text-accent-gold text-xs uppercase tracking-[0.25em] font-bold mb-2">Exclusive</span>
              <h3 className="font-serif text-3xl text-white mb-4">Niche Perfumes</h3>
              <Link href="/store?cat=niche" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white border-b border-accent-gold pb-0.5 w-fit hover:text-accent-gold transition-colors">
                Shop Now
              </Link>
            </div>
          </div>

          {/* Deals card */}
          <div className="relative h-64 overflow-hidden group">
            <Image
              src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1000&auto=format&fit=crop"
              alt="Deals"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/20" />
            <div className="absolute inset-0 p-8 flex flex-col justify-center">
              <span className="text-accent-gold text-xs uppercase tracking-[0.25em] font-bold mb-2">Up to 50% Off</span>
              <h3 className="font-serif text-3xl text-white mb-4">Today&apos;s Deals</h3>
              <Link href="/store?section=deals" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white border-b border-accent-gold pb-0.5 w-fit hover:text-accent-gold transition-colors">
                View Deals
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
