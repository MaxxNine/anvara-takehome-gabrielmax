import { BadgeCheck, Clock, ShieldCheck } from 'lucide-react';

type TrustSignalsBProps = {
  isVerified?: boolean;
};

export function TrustSignalsB({ isVerified }: TrustSignalsBProps) {
  return (
    <div className="space-y-2.5">
      {isVerified && (
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <BadgeCheck className="h-4 w-4 text-[#1b64f2]" />
          <span>Verified publisher</span>
        </div>
      )}
      <div className="flex items-center gap-2 text-sm text-slate-600">
        <ShieldCheck className="h-4 w-4 text-emerald-600" />
        <span>Secure booking</span>
      </div>
      <div className="flex items-center gap-2 text-sm text-slate-600">
        <Clock className="h-4 w-4 text-amber-600" />
        <span>One sponsor per slot</span>
      </div>
    </div>
  );
}
