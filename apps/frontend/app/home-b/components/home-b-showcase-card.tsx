import Image from 'next/image';
import type { CSSProperties } from 'react';

import type { HomeBShowcaseCardItem } from '../content';

type HomeBShowcaseCardProps = {
  index: number;
  isVisible: boolean;
  item: HomeBShowcaseCardItem;
};

const iconClassName = 'h-5 w-5 text-[#1b64f2]';

function ShowcaseIcon({ kind }: { kind: HomeBShowcaseCardItem['icon'] }) {
  if (kind === 'zap') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={iconClassName}>
        <path
          d="M13 2 3 14h8l-1 8 11-13h-8l1-7Z"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (kind === 'chart') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={iconClassName}>
        <path d="M4 20V10" strokeWidth="2" strokeLinecap="round" />
        <path d="M12 20V4" strokeWidth="2" strokeLinecap="round" />
        <path d="M20 20v-7" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={iconClassName}>
      <path
        d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3" strokeWidth="2" />
    </svg>
  );
}

const imageTintClasses: Record<HomeBShowcaseCardItem['artwork'], string> = {
  analytics:
    'bg-[linear-gradient(180deg,rgba(10,27,60,0.06)_0%,rgba(10,27,60,0.34)_100%)]',
  execution:
    'bg-[linear-gradient(180deg,rgba(126,58,14,0.04)_0%,rgba(126,58,14,0.28)_100%)]',
  visibility:
    'bg-[linear-gradient(180deg,rgba(29,78,216,0.05)_0%,rgba(15,23,42,0.32)_100%)]',
};

const imageObjectPositionClasses: Record<HomeBShowcaseCardItem['artwork'], string> = {
  analytics: 'object-center',
  execution: 'object-[center_42%]',
  visibility: 'object-center',
};

function ShowcaseArtwork({ item }: { item: HomeBShowcaseCardItem }) {
  return (
    <div className="relative h-56 overflow-hidden rounded-t-[2rem]">
      <Image
        src={item.imageUrl}
        alt={item.imageAlt}
        fill
        sizes="(min-width: 1024px) 33vw, 100vw"
        className={`object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] ${imageObjectPositionClasses[item.artwork]}`}
      />
      <div className={`absolute inset-0 ${imageTintClasses[item.artwork]}`} />
      <div className="absolute inset-x-0 bottom-0 h-28 bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.28)_44%,rgba(255,255,255,0.66)_100%)]" />
    </div>
  );
}

export function HomeBShowcaseCard({ item, index, isVisible }: HomeBShowcaseCardProps) {
  const style = {
    transitionDelay: `${index * 110}ms`,
  } satisfies CSSProperties;

  return (
    <article
      className={`group relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white shadow-[0_24px_60px_-26px_rgba(15,23,42,0.22)] transition-[opacity,transform,box-shadow] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-[0_34px_80px_-30px_rgba(15,23,42,0.28)] motion-reduce:translate-y-0 motion-reduce:opacity-100 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
      }`}
      style={style}
    >
      <ShowcaseArtwork item={item} />

      <div className="flex flex-1 flex-col p-7 sm:p-8">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50">
            <ShowcaseIcon kind={item.icon} />
          </div>
          <h3 className="text-[1.75rem] font-semibold tracking-tight text-slate-950">
            {item.title}
          </h3>
        </div>

        <p className="mt-5 flex-1 text-base leading-8 text-slate-600">{item.body}</p>

        <a
          href={item.href}
          className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[#1b64f2] transition group-hover:text-blue-700"
        >
          Learn more
          <span aria-hidden="true" className="text-base leading-none">
            ›
          </span>
        </a>
      </div>
    </article>
  );
}
