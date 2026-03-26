import { Star } from 'lucide-react';

import type { HomeBTestimonial } from '../../content';

function getAccentTextClass(accent: HomeBTestimonial['accent']) {
  if (accent === 'secondary') {
    return 'text-cyan-500';
  }

  if (accent === 'tertiary') {
    return 'text-violet-500';
  }

  return 'text-[#1b64f2]';
}

function getAccentAvatarClass(accent: HomeBTestimonial['accent']) {
  if (accent === 'secondary') {
    return 'bg-cyan-500';
  }

  if (accent === 'tertiary') {
    return 'bg-violet-500';
  }

  return 'bg-[#1b64f2]';
}

function TestimonialStars({ accent }: { accent: HomeBTestimonial['accent'] }) {
  return (
    <div className={`flex gap-1 ${getAccentTextClass(accent)}`}>
      {[0, 1, 2, 3, 4].map((index) => (
        <Star key={index} className="h-5 w-5 fill-current" />
      ))}
    </div>
  );
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('');
}

type TestimonialCardProps = {
  testimonial: HomeBTestimonial;
};

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <article className="flex h-full flex-col justify-between rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 shadow-[0_18px_40px_-32px_rgba(15,23,42,0.28)] sm:rounded-[2rem] sm:p-8">
      <div>
        <TestimonialStars accent={testimonial.accent} />
        <p className="mt-5 text-[15px] leading-7 text-slate-700 sm:mt-6 sm:text-base sm:leading-8">
          &quot;{testimonial.quote}&quot;
        </p>
      </div>

      <div className="mt-8 flex items-center gap-4 sm:mt-10">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold text-white sm:h-12 sm:w-12 ${getAccentAvatarClass(
            testimonial.accent
          )}`}
        >
          {getInitials(testimonial.name)}
        </div>
        <div>
          <p className="font-semibold text-slate-950">{testimonial.name}</p>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
            {testimonial.role}
          </p>
        </div>
      </div>
    </article>
  );
}
