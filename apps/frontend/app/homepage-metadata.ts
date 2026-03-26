import type { Metadata } from 'next';

type HomepageMetadataOptions = {
  siteUrl: string;
};

export function getHomepageMetadata({ siteUrl }: HomepageMetadataOptions): Metadata {
  const title = 'Sponsorship Marketplace for Sponsors and Publishers';
  const description =
    'Browse sponsorship inventory across display, video, podcast, and newsletter placements. Anvara helps sponsors and publishers move faster with clearer pricing and availability.';

  return {
    title,
    description,
    alternates: {
      canonical: siteUrl,
    },
    openGraph: {
      title,
      description,
      siteName: 'Anvara',
      type: 'website',
      url: siteUrl,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}
