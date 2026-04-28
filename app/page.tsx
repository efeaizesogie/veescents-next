import { Suspense } from 'react';
import AnnouncementBar from '@/components/AnnouncementBar';
import Hero from '@/components/Hero';
import WhyChooseUs from '@/components/WhyChooseUs';
import FeaturedCategories from '@/components/FeaturedCategories';
import PromoCards from '@/components/PromoCards';
import FeaturedBanner from '@/components/FeaturedBanner';
import HomeProducts from '@/components/HomeProducts';
import SmartSections from '@/components/SmartSections';
import ContactSection from '@/components/ContactSection';

export default function HomePage() {
  return (
    <>
      <AnnouncementBar />
      <Hero />
      <WhyChooseUs />
      <FeaturedCategories />
      <PromoCards />
      <Suspense>
        <HomeProducts />
      </Suspense>
      <SmartSections />
      <FeaturedBanner />
      <ContactSection />
    </>
  );
}
