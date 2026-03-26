type HomeBStructuredDataProps = {
  siteUrl: string;
};

export function HomeBStructuredData({ siteUrl }: HomeBStructuredDataProps) {
  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Anvara',
      url: siteUrl,
      description:
        'Sponsorship marketplace for sponsors and publishers across display, video, podcast, and newsletter placements.',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Anvara',
      url: siteUrl,
      description:
        'Marketplace platform connecting sponsors with publishers through structured sponsorship inventory.',
    },
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
