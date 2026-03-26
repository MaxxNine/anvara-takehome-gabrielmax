import type { Metadata } from 'next';
import { GoogleAnalytics } from '@next/third-parties/google';
import './globals.css';
import { AnalyticsProvider } from './components/analytics-provider';
import { Nav } from './components/nav';
import { QueryProvider } from './components/query-provider';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  title: {
    default: 'Anvara Marketplace',
    template: '%s | Anvara',
  },
  description: 'Sponsorship marketplace connecting sponsors with publishers',
  icons: {
    icon: '/icon.svg',
  },
  openGraph: {
    title: 'Anvara Marketplace',
    description: 'Sponsorship marketplace connecting sponsors with publishers',
    url: siteUrl,
    siteName: 'Anvara',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Anvara Marketplace',
    description: 'Sponsorship marketplace connecting sponsors with publishers',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <QueryProvider>
          <AnalyticsProvider>
            <Nav />
            <main className="mx-auto max-w-6xl p-4 pt-0">{children}</main>
          </AnalyticsProvider>
        </QueryProvider>
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ? (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
        ) : null}
      </body>
    </html>
  );
}
