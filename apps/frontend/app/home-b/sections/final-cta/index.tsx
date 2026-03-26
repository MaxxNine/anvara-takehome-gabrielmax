import { homeBDisplayFont } from '../../fonts';
import { HomeBCtaLink } from '../../shared/cta-link';
import { HomeBReveal } from '../../shared/reveal';
import { NewsletterForm } from './newsletter-form';

export function HomeBFinalCta() {
  return (
    <section className="px-6 py-20 sm:px-8 sm:py-24 lg:px-10 lg:py-28 xl:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-[2rem] bg-slate-950 px-6 py-12 sm:rounded-[2.5rem] sm:px-10 sm:py-14 lg:px-16 lg:py-16 xl:px-20 xl:py-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(27,100,242,0.28),rgba(27,100,242,0)_38%),radial-gradient(circle_at_left,rgba(34,211,238,0.18),rgba(34,211,238,0)_28%)]" />

          <div className="relative mx-auto max-w-3xl text-center">
            <HomeBReveal variant="scale">
              <h2
                className={`${homeBDisplayFont.className} text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl`}
              >
                Ready to join the future of the marketplace?
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-300 sm:mt-6 sm:text-lg sm:leading-8">
                Whether you&apos;re a brand looking for impact or a publisher looking for growth,
                Anvara is your connection engine.
              </p>
            </HomeBReveal>

            <HomeBReveal delayMs={140} variant="up">
              <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:mt-10 sm:flex-row sm:items-center sm:gap-4">
                <HomeBCtaLink
                  href="/login"
                  label="launch_as_sponsor"
                  location="home_b_final_cta"
                >
                  Launch as Sponsor
                </HomeBCtaLink>
                <HomeBCtaLink
                  href="/login"
                  label="join_as_publisher"
                  location="home_b_final_cta"
                  variant="secondary"
                >
                  Join as Publisher
                </HomeBCtaLink>
              </div>
            </HomeBReveal>

            <HomeBReveal delayMs={240} variant="up">
              <NewsletterForm />
            </HomeBReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
