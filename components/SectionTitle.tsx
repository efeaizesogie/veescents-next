export default function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="text-center mb-16 relative">
      <h2 className="font-serif text-4xl text-accent-dark relative inline-block z-10">
        {title}
        <svg className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-3 text-accent-gold" viewBox="0 0 100 10" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 5C20 8 40 2 50 5C60 8 80 2 98 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </h2>
      {subtitle && <p className="mt-4 text-gray-500">{subtitle}</p>}
    </div>
  );
}
