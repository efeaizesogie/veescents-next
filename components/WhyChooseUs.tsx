import { ShieldCheck, Truck, RefreshCw, Star } from "lucide-react";

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "100% Authentic",
    desc: "Every fragrance is sourced directly from verified luxury distributors.",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    desc: "Same-day dispatch in Lagos. Nationwide delivery within 3–5 business days.",
  },
  {
    icon: Star,
    title: "Expert Curation",
    desc: "Our fragrance experts handpick every scent in our collection.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-20 bg-cream-100 border-y border-gray-100">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:items-center">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="flex flex-col items-center text-center group"
            >
              <div className="w-14 h-14 rounded-full border border-accent-gold/30 flex items-center justify-center mb-5 group-hover:bg-accent-gold/10 transition-colors">
                <Icon size={22} className="text-accent-gold" />
              </div>
              <h3 className="font-serif text-lg text-accent-dark mb-2">
                {title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
