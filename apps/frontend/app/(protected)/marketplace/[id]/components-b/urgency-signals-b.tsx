import { Flame, TrendingUp, Users } from 'lucide-react';

type UrgencySignalsBProps = {
  monthlyViews?: number;
  placementCount: number;
};

export function UrgencySignalsB({ monthlyViews, placementCount }: UrgencySignalsBProps) {
  const signals: { icon: React.ReactNode; text: string }[] = [];

  if (placementCount > 0) {
    signals.push({
      icon: <TrendingUp className="h-3.5 w-3.5" />,
      text: `Booked ${placementCount} time${placementCount !== 1 ? 's' : ''} before`,
    });
  }

  if (monthlyViews && monthlyViews > 100_000) {
    signals.push({
      icon: <Flame className="h-3.5 w-3.5" />,
      text: 'High-traffic placement',
    });
  }

  signals.push({
    icon: <Users className="h-3.5 w-3.5" />,
    text: 'One sponsor per slot',
  });

  return (
    <div className="space-y-2">
      {signals.map((signal) => (
        <div
          key={signal.text}
          className="flex items-center gap-2 rounded-xl border border-amber-100 bg-amber-50 px-3 py-2.5 text-xs font-semibold text-amber-700"
        >
          {signal.icon}
          <span>{signal.text}</span>
        </div>
      ))}
    </div>
  );
}
