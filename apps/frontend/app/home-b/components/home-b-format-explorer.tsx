'use client';

import { Search } from 'lucide-react';

import type { HomeBPreviewRound } from '../content';
import { HomeBExplorerCard } from './home-b-explorer-card';
import { useTypewriterRotation } from '../hooks/use-typewriter-rotation';

type HomeBFormatExplorerProps = {
  rounds: HomeBPreviewRound[];
};

export function HomeBFormatExplorer({ rounds }: HomeBFormatExplorerProps) {
  const { activeRound, displayText, phase } = useTypewriterRotation(rounds);

  // Results visible once enough of the query is typed, and during idle hold.
  // Hidden during deletion and waiting (data swaps while hidden).
  const resultsVisible = phase === 'idle' || (phase === 'typing' && displayText.length > 8);

  return (
    <div className="w-full rounded-[1.5rem] border border-white/15 bg-white/10 p-4 backdrop-blur-md sm:p-5">
      {/* Search input */}
      <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
        <Search className="h-[18px] w-[18px] flex-shrink-0 text-white/40" />
        <div className="flex min-h-[20px] items-center text-sm font-medium leading-none">
          <span className="text-white/50">I&apos;m looking to </span>
          <span className="pl-1 text-white">{displayText}</span>
          <span className="ml-0.5 inline-block h-4 w-px animate-pulse bg-blue-400" />
        </div>
      </div>

      {/* Results list — staggered card transitions */}
      <div className="mt-4 space-y-3">
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
