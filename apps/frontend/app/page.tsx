import type { Metadata } from 'next';

import { getForcedABTestVariant } from '@/lib/ab-testing';
import { getServerABVariant } from '@/lib/ab-testing/server';
import { HomeHero } from './components/home-hero';
import { HomeBPage } from './home-b/components/home-b-page';
import { getHomepageMetadata } from './homepage-metadata';

type HomePageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

async function getHomePageVariant(
  searchParams?: Promise<Record<string, string | string[] | undefined>>
): Promise<string> {
  const resolvedSearchParams = (await searchParams) ?? {};

  return getServerABVariant('home-hero-layout', {
    forcedVariant: getForcedABTestVariant('home-hero-layout', resolvedSearchParams),
  });
}

export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  return getHomepageMetadata({ siteUrl });
}

export default async function Home({ searchParams }: HomePageProps) {
  const heroVariant = await getHomePageVariant(searchParams);

  if (heroVariant === 'B') {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    return <HomeBPage siteUrl={siteUrl} />;
  }

  return <HomeHero variant="A" />;
}
