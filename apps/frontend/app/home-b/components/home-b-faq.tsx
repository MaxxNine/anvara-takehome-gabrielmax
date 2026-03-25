import { homeBFaqItems } from '../content';
import { homeBDisplayFont } from '../fonts';

export function HomeBFaq() {
  return (
    <section
      aria-labelledby="home-b-faq-title"
      className="rounded-[2rem] border border-[--color-border] bg-white px-6 py-8 sm:px-8"
    >
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[--color-primary]">
          FAQ
        </p>
        <h2
          id="home-b-faq-title"
          className={`${homeBDisplayFont.className} mt-3 text-3xl font-semibold tracking-[-0.04em] text-[--color-foreground]`}
        >
          Answer the real product questions people will actually have.
        </h2>
      </div>

      <div className="mt-8 space-y-3">
        {homeBFaqItems.map((item) => (
          <details
            key={item.question}
            className="group rounded-[1.5rem] border border-[--color-border] bg-[--color-home-surface-alt] px-5 py-4"
          >
            <summary className="cursor-pointer list-none text-base font-semibold text-[--color-foreground]">
              <span className="flex items-center justify-between gap-4">
                {item.question}
                <span className="text-[--color-primary] transition group-open:rotate-45">+</span>
              </span>
            </summary>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-[--color-muted]">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
