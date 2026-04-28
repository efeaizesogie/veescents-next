import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { connectDB } from '@/lib/mongodb';
import Collection from '@/lib/models/Collection';

async function getCollections() {
  await connectDB();
  return Collection.find().sort({ order: 1 }).lean();
}

export default async function FeaturedCategories() {
  const collections = await getCollections();

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">

        <div className="flex justify-between items-end mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-accent-gold mb-2 block">Explore</span>
            <h2 className="font-serif text-4xl text-accent-dark">Shop by Collection</h2>
          </div>
          <Link href="/collections" className="hidden md:flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-accent-gold hover:text-accent-gold-dark transition-colors">
            All Collections <ArrowRight size={16} />
          </Link>
        </div>

        {/* Asymmetric grid — first item spans 2 rows, rest fill in */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {(collections as any[]).map((col, i) => {
            const isFeatured = i === 0;
            return (
              <Link
                key={col.slug}
                href={`/store?collection=${col.slug}`}
                className={`group relative overflow-hidden bg-gray-100 ${isFeatured ? 'lg:col-span-2 lg:row-span-2 h-[420px]' : 'h-[200px]'}`}
              >
                <Image
                  src={col.image}
                  alt={col.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/80 transition-all duration-500" />
                <div className="absolute inset-0 border border-accent-gold/0 group-hover:border-accent-gold/50 transition-all duration-500" />
                <div className="absolute bottom-0 left-0 p-5 text-white">
                  <h3 className={`font-serif leading-tight ${isFeatured ? 'text-3xl' : 'text-lg'}`}>{col.name}</h3>
                </div>
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-accent-gold/0 group-hover:bg-accent-gold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <ArrowRight size={14} className="text-white" />
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-6 text-center md:hidden">
          <Link href="/collections" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-accent-gold">
            All Collections <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
