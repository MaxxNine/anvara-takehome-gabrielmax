import { homeBBodyFont } from './fonts';
import { HomeBStructuredData } from './seo/structured-data';
import { HomeBAudienceSplit } from './sections/audience-split';
import { HomeBFaq } from './sections/faq';
import { HomeBFeatureStories } from './sections/feature-stories';
import { HomeBFinalCta } from './sections/final-cta';
import { HomeBFooter } from './sections/footer';
import { HomeBHero } from './sections/hero';

type HomeBPageProps = {
  siteUrl: string;
};

export function HomeBPage({ siteUrl }: HomeBPageProps) {
  return (
    <div
      className={`theme-home-b ${homeBBodyFont.className} relative left-1/2 right-1/2 w-[100dvw] max-w-none -translate-x-1/2 overflow-x-hidden bg-[--color-background]`}
    >
      <HomeBStructuredData siteUrl={siteUrl} />
      <HomeBHero />
      <HomeBAudienceSplit />
      <HomeBFeatureStories />
      <HomeBFaq />
      <HomeBFinalCta />
      <HomeBFooter />
    </div>
  );
}
