export type ActionFieldErrors = Record<string, string[]>;

export interface ActionState {
  success: boolean;
  error?: string;
  fieldErrors?: ActionFieldErrors;
}

export const initialActionState: ActionState = {
  success: false,
};
