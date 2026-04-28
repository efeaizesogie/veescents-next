'use client';

import { useState, useEffect } from 'react';

const PROMOS = [
  '✦ Free delivery on orders above ₦50,000',
  '✦ New arrivals every week — shop the latest drops',
  '✦ Authentic luxury fragrances, guaranteed',
  '✦ Gift wrapping available on all orders',
];

export default function AnnouncementBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIndex(i => (i + 1) % PROMOS.length), 3500);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="bg-accent-dark text-white text-xs font-medium tracking-widest uppercase py-2.5 text-center overflow-hidden">
      <span className="animate-fade-in" key={index}>{PROMOS[index]}</span>
    </div>
  );
}
