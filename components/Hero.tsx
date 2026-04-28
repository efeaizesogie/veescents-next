import Link from 'next/link';
import Image from 'next/image';

export default function Hero() {
  return (
    <section id="home" className="relative pt-28 pb-12 bg-cream-50 border-b border-gray-100">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-center">
          <div>
            <span className="text-accent-gold font-semibold tracking-[0.2em] text-[11px] uppercase mb-3 block">
              Veescents Fragrance Store
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-[3.3rem] leading-tight text-accent-dark">
              Shop Original Perfumes
              <br />
              For Every Budget
            </h1>
            <p className="text-gray-600 mt-4 max-w-xl text-sm md:text-base leading-relaxed">
              Discover top-rated designer, Arabian, and everyday fragrances with fast delivery and carefully curated picks.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {['100% Authentic', 'Fast Delivery', 'Best Sellers Updated Daily'].map((item) => (
                <span
                  key={item}
                  className="text-[11px] uppercase tracking-widest bg-white border border-gray-200 px-3 py-2 text-gray-500"
                >
                  {item}
                </span>
              ))}
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/store"
                className="bg-accent-dark text-white px-7 py-3 text-xs font-bold uppercase tracking-widest hover:bg-accent-gold transition-colors"
              >
                Shop Now
              </Link>
              <Link
                href="/collections"
                className="border border-accent-dark text-accent-dark px-7 py-3 text-xs font-bold uppercase tracking-widest hover:bg-accent-dark hover:text-white transition-colors"
              >
                Explore Collections
              </Link>
            </div>

            <div className="mt-7 grid grid-cols-3 gap-4 max-w-md">
              <div>
                <p className="font-serif text-2xl text-accent-dark">2k+</p>
                <p className="text-[11px] uppercase tracking-widest text-gray-400">Orders Served</p>
              </div>
              <div>
                <p className="font-serif text-2xl text-accent-dark">150+</p>
                <p className="text-[11px] uppercase tracking-widest text-gray-400">Product Picks</p>
              </div>
              <div>
                <p className="font-serif text-2xl text-accent-dark">4.8</p>
                <p className="text-[11px] uppercase tracking-widest text-gray-400">Average Rating</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 relative h-56 md:h-64 bg-white overflow-hidden border border-gray-200">
              <Image
                src="/products/original-designer-perfume.jpeg"
                alt="Featured perfumes"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/15 to-transparent" />
              <div className="absolute left-4 bottom-4 text-white">
                <p className="text-[10px] uppercase tracking-widest text-accent-gold">Featured Today</p>
                <p className="font-serif text-2xl leading-tight">Original Designer</p>
              </div>
            </div>
            <div className="relative h-36 md:h-40 bg-white overflow-hidden border border-gray-200">
              <Image src="/products/arabian-luxury-perfume.webp" alt="Arabian luxury perfumes" fill className="object-cover" />
              <div className="absolute inset-0 bg-black/30" />
              <p className="absolute left-3 bottom-3 text-white text-xs uppercase tracking-widest font-semibold">Arabian Luxury</p>
            </div>
            <div className="relative h-36 md:h-40 bg-white overflow-hidden border border-gray-200">
              <Image src="/products/perfume-oil.jpg" alt="Perfume oils" fill className="object-cover" />
              <div className="absolute inset-0 bg-black/30" />
              <p className="absolute left-3 bottom-3 text-white text-xs uppercase tracking-widest font-semibold">Perfume Oils</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
