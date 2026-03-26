import type { ActionState } from '@/lib/action-types';

/**
 * Extract raw string values from FormData for field preservation on errors.
 */
export function extractFieldValues(formData: FormData, keys: string[]): Record<string, string> {
  const values: Record<string, string> = {};
  for (const key of keys) {
    values[key] = (formData.get(key) as string) ?? '';
  }
  return values;
}

/**
 * Convert a Zod flattened error into an ActionState with fieldErrors + fieldValues.
 */
export function validationError(
  fieldErrors: Record<string, string[] | undefined>,
  fieldValues: Record<string, string>
): ActionState {
  const cleaned: Record<string, string[]> = {};
  for (const [key, errors] of Object.entries(fieldErrors)) {
    if (errors && errors.length > 0) cleaned[key] = errors;
  }
  return { success: false, fieldErrors: cleaned, fieldValues };
}
