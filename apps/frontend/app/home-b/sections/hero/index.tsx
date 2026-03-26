import Image from 'next/image';

import { homeBPreviewRounds } from '../../content';
import { homeBDisplayFont } from '../../fonts';
import { HomeBFormatExplorer } from './format-explorer';
import { HomeBProofBand } from './proof-band';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1699480114704-ac153307d2a0?q=80&w=1920&auto=format&fit=crop&ixlib=rb-4.1.0';

export function HomeBHero() {
  return (
    <section
      aria-labelledby="home-b-hero-title"
      className="relative flex min-h-[100dvh] flex-col overflow-hidden"
    >
      {/* Billboard background */}
      <Image
        src={HERO_IMAGE}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      {/* Dark overlay — heavier on left for text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
      {/* Extra bottom darkening for proof band */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/40 to-transparent" />

      {/* Content — pt-20 accounts for fixed nav */}
      <div className="relative mx-auto flex w-full max-w-7xl flex-1 items-center px-6 pb-10 pt-24 sm:px-8 sm:pb-14 sm:pt-28 lg:px-10 lg:pb-16 lg:pt-24 xl:px-12">
        <div className="flex w-full flex-col gap-10 sm:gap-12 lg:flex-row lg:items-center lg:justify-between lg:gap-10 xl:gap-14">
          <div className="max-w-xl text-left lg:max-w-[34rem] xl:max-w-[36rem]">
            <h1
              id="home-b-hero-title"
              className={`${homeBDisplayFont.className} text-[2.5rem] font-bold leading-[1.08] tracking-tight text-white sm:text-[3.2rem] lg:text-[3.75rem] xl:text-[4.2rem]`}
            >
              Connect Your Brand to{' '}
              <br className="hidden sm:inline" />
              <span className="text-[#8faeff]">
                Culture
              </span>{' '}
              at Scale
            </h1>

            <p className="mt-5 max-w-lg text-base leading-7 text-white/75 sm:mt-6 sm:text-lg sm:leading-8">
              Anvara brands and rightsholders connect to high-impact sponsorships, instantly
              discover opportunities, compare options, close deals, and measure success — all in
              one platform.
            </p>

            <div className="mt-8 flex sm:mt-10">
              <a
                href="/login"
                className="inline-flex items-center justify-center rounded-full bg-[#1b64f2] px-6 py-3 text-sm font-bold text-white shadow-[0_16px_40px_-14px_rgba(27,100,242,0.75)] transition-all hover:-translate-y-0.5 hover:bg-blue-500 hover:shadow-[0_18px_48px_-10px_rgba(27,100,242,0.8)] sm:px-8 sm:py-4"
              >
                Try Anvara Free
              </a>
            </div>

            <div className="mt-8 w-full max-w-xl lg:hidden">
              <HomeBFormatExplorer rounds={homeBPreviewRounds} compact />
            </div>
          </div>

          <div className="hidden w-full max-w-2xl lg:block lg:w-[31rem] lg:flex-shrink-0 xl:w-[33rem]">
            <HomeBFormatExplorer rounds={homeBPreviewRounds} />
          </div>
        </div>
      </div>

      <HomeBProofBand />
    </section>
  );
}
