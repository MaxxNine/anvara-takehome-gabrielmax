import { HomeBHowItWorks } from './home-b-how-it-works';
import { HomeBWaveField } from './home-b-wave-field';

export function HomeBTopCanvas() {
  return (
    <div className="relative overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#f7faff_58%,#f7f8fc_100%)]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.96),rgba(255,255,255,0)_38%)]" />
        <div className="home-b-wave-layer home-b-wave-layer-primary">
          <HomeBWaveField className="h-full w-full" />
        </div>
        <div className="home-b-wave-layer home-b-wave-layer-secondary">
          <HomeBWaveField mirrored className="h-full w-full" />
        </div>
      </div>

      <div className="relative z-10">
        <HomeBHowItWorks />
      </div>

      {/* Fade into flat page background */}
      <div className="h-24 bg-[linear-gradient(to_bottom,transparent,var(--color-background))]" />
    </div>
  );
}
