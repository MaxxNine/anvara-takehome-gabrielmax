type PlacementSuccessNoticeProps = {
  onReset: () => void;
};

export function PlacementSuccessNotice({ onReset }: PlacementSuccessNoticeProps) {
  return (
    <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4">
      <h3 className="font-semibold text-green-800">Placement Booked!</h3>
      <p className="mt-1 text-sm text-green-700">
        Your request has been submitted. The publisher will be in touch soon.
      </p>
      <button
        type="button"
        onClick={onReset}
        className="mt-3 text-sm text-green-700 underline hover:text-green-800"
      >
        Remove Booking (reset for testing)
      </button>
    </div>
  );
}
