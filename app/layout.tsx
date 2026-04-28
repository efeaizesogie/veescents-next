import type { Metadata } from 'next';
import { DM_Sans, Playfair_Display } from 'next/font/google';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { StoreProvider } from '@/context/StoreContext';
import SiteShell from '@/components/SiteShell';

const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair', style: ['normal', 'italic'] });

export const metadata: Metadata = {
  title: 'Veescents | Luxury Perfumes',
  description: 'Smell is a word, Perfume is literature.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${dmSans.variable} ${playfair.variable} scroll-smooth`}>
        <body className="bg-cream-50 text-accent-dark font-sans selection:bg-accent-gold selection:text-white">
          <StoreProvider>
            <SiteShell>{children}</SiteShell>
          </StoreProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
