// TODO: This should be a marketing landing page, not just a simple welcome screen
// TODO: Add proper metadata for SEO (title, description, Open Graph)
// TODO: Add hero section, features, testimonials, etc.
// HINT: Check out the bonus challenge for marketing landing page!

import { getForcedABTestVariant } from '@/lib/ab-testing';
import { getServerABVariant } from '@/lib/ab-testing/server';
import { HomeHero } from './components/home-hero';

type HomePageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Home({ searchParams }: HomePageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const heroVariant = await getServerABVariant('home-hero-layout', {
    forcedVariant: getForcedABTestVariant('home-hero-layout', resolvedSearchParams),
  });

  return <HomeHero variant={heroVariant} />;
}
