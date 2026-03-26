import type { ActionState } from '@/lib/action-types';

type ActionErrorNoticeProps = {
  state: Pick<ActionState, 'error' | 'errorKind' | 'retryAfterSeconds'> | null | undefined;
};

function formatRetryAfter(retryAfterSeconds: number): string {
  if (retryAfterSeconds < 60) {
    return `${retryAfterSeconds} second${retryAfterSeconds === 1 ? '' : 's'}`;
  }

  const minutes = Math.ceil(retryAfterSeconds / 60);
  return `${minutes} minute${minutes === 1 ? '' : 's'}`;
}

export function ActionErrorNotice({ state }: ActionErrorNoticeProps) {
  if (!state?.error) {
    return null;
  }

  const isRateLimited = state.errorKind === 'rate_limit';
  const retryAfterLabel =
    isRateLimited && state.retryAfterSeconds
      ? ` Please wait ${formatRetryAfter(state.retryAfterSeconds)} and try again.`
      : '';

  return (
    <div
      className={
        isRateLimited
          ? 'rounded border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800'
          : 'rounded border border-red-200 bg-red-50 p-3 text-sm text-red-600'
      }
    >
      {state.error}
      {retryAfterLabel}
    </div>
  );
}
