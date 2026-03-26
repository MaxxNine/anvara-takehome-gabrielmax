import { useId } from 'react';

type HomeBWaveFieldProps = {
  className?: string;
  mirrored?: boolean;
};

export function HomeBWaveField({ className, mirrored = false }: HomeBWaveFieldProps) {
  const gradientId = useId();

  return (
    <div className={className} aria-hidden="true">
      <svg
        viewBox="0 0 1400 720"
        className={`h-full w-full ${mirrored ? '-scale-x-100' : ''}`}
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8fdcff" />
            <stop offset="60%" stopColor="#6f8cff" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>

        {[...Array(5)].map((_, index) => {
          const yOffset = 60 + index * 55;

          return (
            <path
              key={`top-${index}`}
              d={`M 520 ${yOffset} C 720 ${yOffset - 28}, 920 ${yOffset + 110}, 1400 ${yOffset + 28}`}
              fill="none"
              stroke={`url(#${gradientId})`}
              strokeOpacity={0.06 + index * 0.015}
              strokeWidth="1.2"
            />
          );
        })}

        {[...Array(5)].map((_, index) => {
          const yOffset = 380 + index * 50;

          return (
            <path
              key={`bottom-${index}`}
              d={`M 360 ${yOffset} C 600 ${yOffset - 120}, 980 ${yOffset + 18}, 1400 ${yOffset - 72}`}
              fill="none"
              stroke={`url(#${gradientId})`}
              strokeOpacity={0.05 + index * 0.015}
              strokeWidth="1.2"
            />
          );
        })}
      </svg>
    </div>
  );
}
