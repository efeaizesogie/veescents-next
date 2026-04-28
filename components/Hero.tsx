import Link from 'next/link';
import Image from 'next/image';

export default function Hero() {
  return (
    <section id="home" className="relative pt-32 pb-20 overflow-hidden bg-cream-50">
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/2 relative flex justify-center items-center mb-16 md:mb-0">
            <div className="absolute top-10 left-10 md:left-20 w-64 h-64 md:w-96 md:h-96 bg-accent-gold/20 rounded-full opacity-60 -z-10 translate-y-[-20%] translate-x-[-20%]" />
            <div className="absolute top-0 right-10 w-4 h-4 bg-accent-gold rotate-45" />
            <div className="absolute bottom-20 left-10 w-3 h-3 border border-accent-gold rotate-12" />
            <div className="absolute top-1/2 right-1/4 w-3 h-3 bg-accent-gold/40 rounded-full" />
            <div className="relative z-10 transform hover:-translate-y-2 transition-transform duration-700">
              <div className="w-64 h-80 md:w-80 md:h-96 relative rounded-t-full overflow-hidden shadow-2xl shadow-accent-gold/20 border-2 border-accent-gold/30">
                <Image
                  src="https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=800&auto=format&fit=crop"
                  alt="Luxury Perfume"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-black/40 to-transparent pointer-events-none" />
              </div>
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-48 h-4 bg-accent-gold/20 blur-xl rounded-full" />
            </div>
          </div>

          <div className="w-full md:w-1/2 text-center md:text-left md:pl-12">
            <span className="text-accent-gold/70 font-medium tracking-[0.3em] text-xs uppercase mb-4 block">
              Luxury Fragrance Store
            </span>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-accent-dark leading-[1.15] mb-8">
              Smell is a word <br />
              <span className="text-accent-dark">Perfume is</span> <br />
              <span className="italic text-accent-gold">Literature</span>
            </h1>
            <p className="text-gray-500 mb-10 max-w-md mx-auto md:mx-0 leading-relaxed">
              Discover scents that tell your unique story. A curated collection of fragrances designed to evoke memories and emotions.
            </p>
            <Link
              href="/#new-collection"
              className="inline-block bg-accent-gold text-white px-10 py-4 rounded-sm hover:bg-accent-gold-dark transition-all duration-300 shadow-lg shadow-accent-gold/20 text-sm font-bold tracking-wider uppercase transform hover:translate-y-px"
            >
              Buy Now
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
