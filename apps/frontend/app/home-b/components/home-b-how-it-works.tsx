'use client';

import { useEffect, useRef, useState } from 'react';

import { homeBShowcaseCards } from '../content';
import { HomeBShowcaseCard } from './home-b-showcase-card';

export function HomeBHowItWorks() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (!entry?.isIntersecting) {
          return;
        }

        setIsVisible(true);
        observer.disconnect();
      },
      { threshold: 0.18 }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="home-b-showcase-title"
      className="relative px-6 pb-24 pt-14 sm:px-10 sm:pb-28 lg:pt-16"
    >
      <div className="mx-auto max-w-7xl">
        <h2 id="home-b-showcase-title" className="sr-only">
          Why teams use Anvara
        </h2>

        <div className="grid gap-8 lg:grid-cols-3">
          {homeBShowcaseCards.map((item, index) => (
            <HomeBShowcaseCard
              key={item.title}
              item={item}
              index={index}
              isVisible={isVisible}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
