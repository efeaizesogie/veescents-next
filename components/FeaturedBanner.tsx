import Image from 'next/image';

export default function FeaturedBanner() {
  return (
    <section className="py-24 bg-cream-50 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="bg-white rounded-sm p-8 md:p-0 relative shadow-sm">
          <div className="flex flex-col md:flex-row items-center">
            <div className="w-full md:w-5/12 md:pl-16 py-12 z-10 relative">
              <div className="absolute -top-10 left-10 md:left-40 w-16 h-16 pointer-events-none">
                <svg viewBox="0 0 100 100" className="text-accent-gold w-full h-full stroke-current fill-none stroke-2">
                  <path d="M0,50 Q25,0 50,50 T100,50" />
                </svg>
              </div>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-tight mb-6">
                New Perfume <br /> Collection
              </h2>
              <div className="text-3xl text-accent-gold font-serif mb-8">₦512,000</div>
              <button className="bg-accent-dark text-white px-8 py-3 rounded-sm hover:bg-accent-gold transition-colors duration-300 text-xs font-bold uppercase tracking-widest">
                Shop Now
              </button>
            </div>

            <div className="w-full md:w-7/12 relative h-96 md:h-[500px] bg-gray-100 overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1000&auto=format&fit=crop"
                alt="New Perfume Collection"
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 60vw"
              />
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-accent-gold/30 rounded-tl-full" />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-64 h-64 rounded-full bg-white/30 backdrop-blur-md absolute top-1/2 right-20 transform -translate-y-1/2 hidden md:block" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
