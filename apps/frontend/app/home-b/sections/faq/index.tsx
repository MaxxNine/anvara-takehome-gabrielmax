'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

import { homeBFaqItems } from '../../content';
import { homeBDisplayFont } from '../../fonts';

export function HomeBFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section
      aria-labelledby="home-b-faq-title"
      className="bg-[linear-gradient(180deg,#f5f8ff_0%,#f7f8fc_100%)] px-6 py-20 sm:px-8 sm:py-24 lg:px-10 lg:py-28 xl:px-12"
    >
      <div className="mx-auto max-w-4xl">
        <div className="mb-12 text-center sm:mb-14">
          <h2
            id="home-b-faq-title"
            className={`${homeBDisplayFont.className} text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl`}
          >
            Common Questions
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
            Everything you need to know about the Anvara marketplace.
          </p>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {homeBFaqItems.map((item, index) => {
            const isOpen = openIndex === index;
            const buttonId = `home-b-faq-button-${index}`;
            const panelId = `home-b-faq-panel-${index}`;

            return (
              <article
                key={item.question}
                className="overflow-hidden rounded-[1.25rem] border border-slate-200 bg-white shadow-[0_18px_40px_-34px_rgba(15,23,42,0.3)] sm:rounded-[1.5rem]"
              >
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() =>
                      setOpenIndex((currentOpenIndex) =>
                        currentOpenIndex === index ? null : index
                      )
                    }
                    className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left text-[15px] font-semibold text-slate-950 sm:gap-6 sm:px-6 sm:py-5 sm:text-base lg:px-7 lg:py-6"
                  >
                    <span>{item.question}</span>
                    <ChevronDown
                      className={`h-5 w-5 flex-shrink-0 text-slate-400 transition-transform duration-300 ease-out ${
                        isOpen ? 'rotate-180' : 'rotate-0'
                      }`}
                    />
                  </button>
                </h3>

                <div
                  className={`grid overflow-hidden px-5 transition-[grid-template-rows,opacity] duration-300 ease-out sm:px-6 lg:px-7 ${
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    className="min-h-0 overflow-hidden"
                  >
                    <p
                      className={`text-sm leading-7 text-slate-600 transition-[padding-bottom] duration-300 ease-out ${
                        isOpen ? 'pb-5 sm:pb-6 lg:pb-7' : 'pb-0'
                      }`}
                    >
                      {item.answer}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
