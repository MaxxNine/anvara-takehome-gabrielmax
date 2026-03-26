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
    <article className="flex h-full flex-col justify-between rounded-[2rem] border border-slate-200 bg-slate-50 p-8 shadow-[0_18px_40px_-32px_rgba(15,23,42,0.28)]">
      <div>
        <TestimonialStars accent={testimonial.accent} />
        <p className="mt-6 text-base leading-8 text-slate-700">&quot;{testimonial.quote}&quot;</p>
      </div>

      <div className="mt-10 flex items-center gap-4">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold text-white ${getAccentAvatarClass(
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
