export type ActionFieldErrors = Record<string, string[]>;
export type ActionErrorKind = 'rate_limit';

export type ActionState = {
  success: boolean;
  error?: string;
  errorKind?: ActionErrorKind;
  fieldErrors?: ActionFieldErrors;
  fieldValues?: Record<string, string>;
  retryAfterSeconds?: number;
};

export const initialActionState: ActionState = {
  success: false,
};
