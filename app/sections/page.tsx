import Link from 'next/link';
import { connectDB } from '@/lib/mongodb';
import Section from '@/lib/models/Section';
import Product from '@/lib/models/Product';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

const SECTION_IMAGES: Record<string, string> = {
  new_collection: 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1200&auto=format&fit=crop',
  gallery: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1200&auto=format&fit=crop',
};

const FALLBACK = 'https://images.unsplash.com/photo-1512777576255-a876cea05f8e?q=80&w=1200&auto=format&fit=crop';

async function getSections() {
  await connectDB();
  // seed defaults
  const DEFAULTS = [
    { name: 'New Collection', slug: 'new_collection', description: 'Latest arrivals and new releases', order: 0 },
    { name: 'Gallery', slug: 'gallery', description: 'Main product gallery', order: 1 },
  ];
  await Promise.all(
    DEFAULTS.map(d => Section.updateOne({ slug: d.slug }, { $setOnInsert: d }, { upsert: true }))
  );
  const sections = await Section.find().sort({ order: 1, name: 1 }).lean() as any[];
  const withCounts = await Promise.all(
    sections.map(async (s) => {
      const count = await Product.countDocuments({ section: s.slug });
      // grab one product image as preview
      const sample = await Product.findOne({ section: s.slug }).lean() as any;
      return { ...s, count, sampleImage: sample?.image || null };
    })
  );
  return withCounts;
}

export default async function SectionsPage() {
  const sections = await getSections();

  return (
    <div className="pt-32 pb-20 bg-cream-50 min-h-screen">
      <div className="container mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-xs uppercase tracking-widest text-accent-gold font-medium mb-3">Browse By</p>
          <h1 className="font-serif text-4xl md:text-5xl text-accent-dark">Sections</h1>
          <p className="text-gray-400 mt-3 max-w-md mx-auto text-sm">Explore our curated product sections — from new arrivals to our full gallery.</p>
        </div>

        {/* Fixed quick-access cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          {[
            { label: 'All Products', href: '/store', desc: 'Browse every fragrance we carry.' },
            { label: 'New Arrivals', href: '/store?sort=newest', desc: 'The latest additions to our store.' },
            { label: 'Best Sellers', href: '/store?sort=best_selling', desc: 'Our most loved fragrances.' },
          ].map(item => (
            <Link key={item.label} href={item.href}
              className="bg-white border border-gray-100 rounded-sm p-6 shadow-sm hover:border-accent-gold transition-colors group">
              <h3 className="font-serif text-xl text-accent-dark mb-2 group-hover:text-accent-gold transition-colors">{item.label}</h3>
              <p className="text-sm text-gray-400 mb-4">{item.desc}</p>
              <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-accent-gold">
                Shop Now <ArrowRight size={13} />
              </span>
            </Link>
          ))}
        </div>

        {/* Dynamic DB sections */}
        <div className="grid gap-10">
          {sections.map((s, idx) => {
            const bg = s.sampleImage
              ? (s.sampleImage.startsWith('http') ? s.sampleImage : s.sampleImage)
              : (SECTION_IMAGES[s.slug] || FALLBACK);
            return (
              <Link key={s._id.toString()} href={`/sections/${s.slug}`}
                className={`flex flex-col md:flex-row items-center gap-0 bg-white rounded-sm shadow-sm overflow-hidden group cursor-pointer ${idx % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                <div className="w-full md:w-1/2 h-64 md:h-80 relative overflow-hidden">
                  <Image
                    src={bg}
                    alt={s.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    unoptimized={!bg.startsWith('/')}
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                </div>
                <div className="w-full md:w-1/2 p-8 md:px-14">
                  <p className="text-xs uppercase tracking-widest text-accent-gold font-medium mb-2">{s.count} products</p>
                  <h2 className="font-serif text-3xl md:text-4xl text-accent-dark mb-3">{s.name}</h2>
                  {s.description && <p className="text-gray-400 text-sm mb-6">{s.description}</p>}
                  <span className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-accent-gold group-hover:text-accent-dark transition-colors">
                    Browse Section <ArrowRight size={15} />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
