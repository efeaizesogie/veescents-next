import { connectDB } from "@/lib/mongodb";
import Collection from "@/lib/models/Collection";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import RecommendedPerfumes from "@/components/RecommendedPerfumes";

async function getCollections() {
  await connectDB();
  return Collection.find().sort({ order: 1 }).lean();
}

export const metadata = { title: "Collections | Veescents" };

export default async function CollectionsPage() {
  const collections = await getCollections();

  return (
    <div className="page-shell bg-cream-50 min-h-screen">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-accent-gold mb-3 block">
            Browse
          </span>
          <h1 className="font-serif text-3xl md:text-4xl text-accent-dark mb-3">
            Our Collections
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto leading-relaxed">
            Explore our curated range of fragrances, body care, and home scents
            — something for every mood and occasion.
          </p>
        </div>

        {/* Featured first item full-width banner */}
        {(collections as any[]).slice(0, 1).map((col) => (
          <Link
            key={col.slug}
            href={`/store?collection=${col.slug}`}
            className="group relative overflow-hidden block w-full h-[340px] mb-3"
          >
            <Image
              src={col.image}
              alt={col.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="100vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
            <div className="absolute inset-0 border-2 border-accent-gold/0 group-hover:border-accent-gold/50 transition-all duration-500" />
            <div className="absolute bottom-0 left-0 p-6 md:p-8">
              <span className="text-accent-gold text-xs uppercase tracking-[0.3em] font-bold mb-2 block">
                Featured Collection
              </span>
              <h2 className="font-serif text-3xl md:text-4xl text-white mb-3">
                {col.name}
              </h2>
              <p className="text-white/70 text-sm mb-6 max-w-md">
                {col.description}
              </p>
              <span className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-white border-b border-accent-gold pb-0.5 group-hover:gap-4 transition-all">
                Shop Now <ArrowRight size={15} />
              </span>
            </div>
          </Link>
        ))}

        {/* Remaining collections grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {(collections as any[]).slice(1).map((col) => (
            <Link
              key={col.slug}
              href={`/store?collection=${col.slug}`}
              className="group relative overflow-hidden block aspect-[4/3] bg-gray-100"
            >
              <Image
                src={col.image}
                alt={col.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
              <div className="absolute inset-0 border-2 border-accent-gold/0 group-hover:border-accent-gold/60 transition-all duration-500" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h2 className="font-serif text-2xl text-white mb-1">
                  {col.name}
                </h2>
                <p className="text-white/60 text-xs mb-4 line-clamp-1">
                  {col.description}
                </p>
                <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-accent-gold group-hover:gap-3 transition-all">
                  Shop Now <ArrowRight size={12} />
                </span>
              </div>
            </Link>
          ))}
        </div>

        <RecommendedPerfumes />
      </div>
    </div>
  );
}
