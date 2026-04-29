import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import Section from "@/lib/models/Section";
import Product from "@/lib/models/Product";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import RecommendedPerfumes from "@/components/RecommendedPerfumes";

export const dynamic = "force-dynamic";

const FALLBACK =
  "https://images.unsplash.com/photo-1512777576255-a876cea05f8e?q=80&w=1200&auto=format&fit=crop";

async function getSections() {
  await connectDB();
  // seed defaults
  const DEFAULTS = [
    {
      name: "New Collection",
      slug: "new_collection",
      description: "Latest arrivals and new releases",
      order: 0,
    },
    {
      name: "Gallery",
      slug: "gallery",
      description: "Main product gallery",
      order: 1,
    },
  ];
  await Promise.all(
    DEFAULTS.map((d) =>
      Section.updateOne({ slug: d.slug }, { $setOnInsert: d }, { upsert: true })
    )
  );
  const sections = (await Section.find()
    .sort({ order: 1, name: 1 })
    .lean()) as Array<{
    _id: { toString(): string };
    slug: string;
    name: string;
    description?: string;
    image?: string;
  }>;
  const withCounts = await Promise.all(
    sections.map(async (s) => {
      const count = await Product.countDocuments({ section: s.slug });
      // grab one product image as preview
      const sample = (await Product.findOne({ section: s.slug }).lean()) as {
        image?: string;
      } | null;
      return { ...s, count, sampleImage: sample?.image || null };
    })
  );
  return withCounts;
}

export default async function SectionsPage() {
  const sections = await getSections();

  return (
    <div className="page-shell bg-cream-50 min-h-screen">
      <div className="container mx-auto px-6">
        <div className="text-center mb-8">
          <p className="text-xs uppercase tracking-widest text-accent-gold font-medium mb-3">
            Browse By
          </p>
          <h1 className="font-serif text-3xl md:text-4xl text-accent-dark">
            Sections
          </h1>
          <p className="text-gray-400 mt-3 max-w-md mx-auto text-sm">
            Explore our curated product sections — from new arrivals to our full
            gallery.
          </p>
        </div>

        {/* Fixed quick-access cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {[
            {
              label: "All Products",
              href: "/store",
              desc: "Browse every fragrance we carry.",
            },
            {
              label: "New Arrivals",
              href: "/store?sort=newest",
              desc: "The latest additions to our store.",
            },
            {
              label: "Best Sellers",
              href: "/store?sort=best_selling",
              desc: "Our most loved fragrances.",
            },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="bg-white border border-gray-100 rounded-sm p-4 shadow-sm hover:border-accent-gold transition-colors group"
            >
              <h3 className="font-serif text-lg text-accent-dark mb-1.5 group-hover:text-accent-gold transition-colors">
                {item.label}
              </h3>
              <p className="text-sm text-gray-500 mb-3">{item.desc}</p>
              <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-accent-gold">
                Shop Now <ArrowRight size={13} />
              </span>
            </Link>
          ))}
        </div>

        {/* Dynamic DB sections */}
        <div className="grid gap-6">
          {sections.map((s, idx) => {
            const bg = s.image || s.sampleImage || FALLBACK;
            return (
              <Link
                key={s._id.toString()}
                href={`/sections/${s.slug}`}
                className={`flex flex-col md:flex-row items-center gap-0 bg-white rounded-sm shadow-sm overflow-hidden group cursor-pointer ${
                  idx % 2 === 1 ? "md:flex-row-reverse" : ""
                }`}
              >
                <div className="w-full md:w-[45%] h-52 md:h-64 relative overflow-hidden">
                  <Image
                    src={bg}
                    alt={s.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    unoptimized={!bg.startsWith("/")}
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                </div>
                <div className="w-full md:w-[55%] p-5 md:px-8 md:py-6">
                  <p className="text-xs uppercase tracking-widest text-accent-gold font-medium mb-2">
                    {s.count} products
                  </p>
                  <h2 className="font-serif text-2xl md:text-3xl text-accent-dark mb-2">
                    {s.name}
                  </h2>
                  {s.description && (
                    <p className="text-gray-600 text-sm mb-4">
                      {s.description}
                    </p>
                  )}
                  <span className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-accent-gold group-hover:text-accent-dark transition-colors">
                    Browse Section <ArrowRight size={15} />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        <RecommendedPerfumes />
      </div>
    </div>
  );
}
