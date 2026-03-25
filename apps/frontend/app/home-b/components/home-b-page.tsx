import { homeBBodyFont } from '../fonts';
import { HomeBAudienceSplit } from './home-b-audience-split';
import { HomeBFeatureStories } from './home-b-feature-stories';
import { HomeBFaq } from './home-b-faq';
import { HomeBFeaturedInventory } from './home-b-featured-inventory';
import { HomeBFinalCta } from './home-b-final-cta';
import { HomeBHero } from './home-b-hero';
import { HomeBHowItWorks } from './home-b-how-it-works';
import { HomeBProofBand } from './home-b-proof-band';
import { HomeBStructuredData } from './home-b-structured-data';

type HomeBPageProps = {
  siteUrl: string;
};

export function HomeBPage({ siteUrl }: HomeBPageProps) {
  return (
    <div
      className={`theme-home-b ${homeBBodyFont.className} bg-[var(--color-background)] text-[var(--color-foreground)] space-y-4 py-4 sm:space-y-5 sm:py-6`}
    >
      <HomeBStructuredData siteUrl={siteUrl} />
      <HomeBHero />
      <HomeBProofBand />
      <HomeBFeaturedInventory />
      <HomeBAudienceSplit />
      <HomeBHowItWorks />
      <HomeBFeatureStories />
      <HomeBFaq />
      <HomeBFinalCta />
    </div>
  );
}
