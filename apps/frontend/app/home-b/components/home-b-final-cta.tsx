import { HomeBCtaLink } from './home-b-cta-link';

export function HomeBFinalCta() {
  return (
    <section className="px-6 py-24 sm:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-[2.75rem] bg-slate-950 px-8 py-14 sm:px-14 sm:py-18 lg:px-20 lg:py-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(27,100,242,0.28),rgba(27,100,242,0)_38%),radial-gradient(circle_at_left,rgba(34,211,238,0.18),rgba(34,211,238,0)_28%)]" />

          <div className="relative mx-auto max-w-3xl text-center">
            <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Ready to join the future of the marketplace?
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-300">
              Whether you&apos;re a brand looking for impact or a publisher looking for growth,
              Anvara is your connection engine.
            </p>

            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
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
          </div>
        </div>
      </div>
    </section>
  );
}
