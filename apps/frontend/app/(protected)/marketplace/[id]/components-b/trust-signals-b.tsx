import { BadgeCheck, Clock, ShieldCheck } from 'lucide-react';

type TrustSignalsBProps = {
  isVerified?: boolean;
};

export function TrustSignalsB({ isVerified }: TrustSignalsBProps) {
  return (
    <div className="space-y-2.5">
      {isVerified && (
        <div className="flex items-center gap-2 text-sm text-[--color-muted]">
          <BadgeCheck className="h-4 w-4 text-blue-400" />
          <span>Verified publisher</span>
        </div>
      )}
      <div className="flex items-center gap-2 text-sm text-[--color-muted]">
        <ShieldCheck className="h-4 w-4 text-emerald-400" />
        <span>Secure booking</span>
      </div>
      <div className="flex items-center gap-2 text-sm text-[--color-muted]">
        <Clock className="h-4 w-4 text-amber-400" />
        <span>Cancel anytime</span>
      </div>
    </div>
  );
}
