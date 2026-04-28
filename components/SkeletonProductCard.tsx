export default function SkeletonProductCard() {
  return (
    <div className="flex flex-col items-center animate-pulse">
      <div className="w-full aspect-[4/5] bg-gray-200 mb-6 rounded-sm" />
      <div className="flex gap-0.5 mb-3 w-20 justify-center">
        {[...Array(5)].map((_, i) => <div key={i} className="w-2 h-2 bg-gray-200 rounded-full mx-0.5" />)}
      </div>
      <div className="w-3/4 h-5 bg-gray-200 mb-2 rounded" />
      <div className="w-1/2 h-3 bg-gray-200 mb-3 rounded" />
      <div className="w-16 h-4 bg-gray-200 rounded mb-1" />
      <div className="w-20 h-3 bg-gray-200 rounded mt-1" />
    </div>
  );
}
