import { homeBFaqItems } from '../content';
import { homeBDisplayFont } from '../fonts';

export function HomeBFaq() {
  return (
    <section
      aria-labelledby="home-b-faq-title"
      className="bg-[linear-gradient(180deg,#f5f8ff_0%,#f7f8fc_100%)] px-6 py-24 sm:px-10"
    >
      <div className="mx-auto max-w-4xl">
        <div className="mb-14 text-center">
          <h2
            id="home-b-faq-title"
            className={`${homeBDisplayFont.className} text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl`}
          >
            Common Questions
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
            Everything you need to know about the Anvara marketplace.
          </p>
        </div>

        <div className="space-y-4">
          {homeBFaqItems.map((item) => (
            <details
              key={item.question}
              className="group overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-[0_18px_40px_-34px_rgba(15,23,42,0.3)]"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 px-6 py-5 text-left text-base font-semibold text-slate-950 sm:px-7 sm:py-6">
                {item.question}
                <svg
                  className="h-5 w-5 flex-shrink-0 text-slate-400 transition-transform group-open:rotate-180"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
                </svg>
              </summary>
              <p className="px-6 pb-6 text-sm leading-7 text-slate-600 sm:px-7 sm:pb-7">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
