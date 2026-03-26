import type { ReactNode } from 'react';

type PlacementSuccessNoticeProps = {
  resetControl?: ReactNode;
};

export function PlacementSuccessNotice({ resetControl }: PlacementSuccessNoticeProps) {
  return (
    <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4">
      <h3 className="font-semibold text-green-800">Placement Booked!</h3>
      <p className="mt-1 text-sm text-green-700">
        Your request has been submitted. The publisher will be in touch soon.
      </p>
      {resetControl}
    </div>
  );
}
