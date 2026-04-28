import { Suspense } from 'react';
import AnnouncementBar from '@/components/AnnouncementBar';
import Hero from '@/components/Hero';
import WhyChooseUs from '@/components/WhyChooseUs';
import FeaturedCategories from '@/components/FeaturedCategories';
import PromoCards from '@/components/PromoCards';
import HomeProducts from '@/components/HomeProducts';
import BestSellers from '@/components/BestSellers';
import Recommendations from '@/components/Recommendations';
import FeaturedBanner from '@/components/FeaturedBanner';
import ContactSection from '@/components/ContactSection';

export default function HomePage() {
  return (
    <>
      <AnnouncementBar />
      <Hero />
      <WhyChooseUs />
      <Suspense fallback={<div className="py-20 bg-white" />}>
        <FeaturedCategories />
      </Suspense>
      <PromoCards />
      <Suspense>
        <HomeProducts />
      </Suspense>
      <BestSellers />
      <Recommendations />
      <FeaturedBanner />
      <ContactSection />
    </>
  );
}
