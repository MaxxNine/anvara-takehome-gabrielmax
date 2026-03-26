import { homeBBodyFont } from '../fonts';
import { HomeBAudienceSplit } from './home-b-audience-split';
import { HomeBFaq } from './home-b-faq';
import { HomeBFeatureStories } from './home-b-feature-stories';
import { HomeBFinalCta } from './home-b-final-cta';
import { HomeBFooter } from './home-b-footer';
import { HomeBHero } from './home-b-hero';
import { HomeBStructuredData } from './home-b-structured-data';

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
