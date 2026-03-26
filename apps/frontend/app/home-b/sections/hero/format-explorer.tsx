'use client';

import { Search } from 'lucide-react';

import type { HomeBPreviewRound } from '../../content';
import { HomeBExplorerCard } from './explorer-card';
import { useTypewriterRotation } from './use-typewriter-rotation';

type HomeBFormatExplorerProps = {
  rounds: HomeBPreviewRound[];
};

export function HomeBFormatExplorer({ rounds }: HomeBFormatExplorerProps) {
  const { activeRound, displayText, phase } = useTypewriterRotation(rounds);

  // Results visible once enough of the query is typed, and during idle hold.
  // Hidden during deletion and waiting (data swaps while hidden).
  const resultsVisible = phase === 'idle' || (phase === 'typing' && displayText.length > 8);

  return (
    <div className="w-full rounded-[1.25rem] border border-white/15 bg-white/10 p-3 backdrop-blur-md sm:rounded-[1.5rem] sm:p-5">
      {/* Search input */}
      <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 sm:gap-3 sm:px-4 sm:py-3">
        <Search className="h-4 w-4 flex-shrink-0 text-white/40 sm:h-[18px] sm:w-[18px]" />
        <div className="flex min-h-[18px] min-w-0 flex-1 items-center overflow-hidden text-xs font-medium leading-none sm:min-h-[20px] sm:text-sm">
          <span className="shrink-0 text-white/50">I&apos;m looking to </span>
          <span className="min-w-0 truncate pl-1 text-white">{displayText}</span>
          <span className="ml-0.5 inline-block h-4 w-px animate-pulse bg-blue-400" />
        </div>
      </div>

      {/* Results list — staggered card transitions */}
      <div className="mt-3 space-y-2.5 sm:mt-4 sm:space-y-3">
        {activeRound.slots.map((slot, index) => (
          <div
            key={slot.name}
            className={`transition-all duration-500 ease-out ${
              resultsVisible ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
            }`}
            style={{
              transitionDelay: resultsVisible ? `${index * 150}ms` : '0ms',
            }}
          >
            <HomeBExplorerCard slot={slot} />
          </div>
        ))}
      </div>
    </div>
  );
}
