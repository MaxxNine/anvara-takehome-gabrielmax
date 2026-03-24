export type ActionFieldErrors = Record<string, string[]>;

export type ActionState = {
  success: boolean;
  error?: string;
  fieldErrors?: ActionFieldErrors;
  fieldValues?: Record<string, string>;
};

export const initialActionState: ActionState = {
  success: false,
};
