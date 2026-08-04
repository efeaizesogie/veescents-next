import type { Metadata } from 'next';
import { Jost } from 'next/font/google';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { StoreProvider } from '@/context/StoreContext';
import SiteShell from '@/components/SiteShell';

const jost = Jost({ subsets: ['latin'], variable: '--font-jost' });

export const metadata: Metadata = {
  title: 'Veescents | Luxury Perfumes',
  description: 'Smell is a word, Perfume is literature.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          fontFamily: 'var(--font-jost), sans-serif',
        },
      }}
    >
      <html lang="en" className={`${jost.variable} scroll-smooth`} suppressHydrationWarning>
        <body className={`${jost.className} bg-cream-50 text-accent-dark font-sans selection:bg-accent-gold selection:text-white`} suppressHydrationWarning>
          <StoreProvider>
            <SiteShell>{children}</SiteShell>
          </StoreProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
