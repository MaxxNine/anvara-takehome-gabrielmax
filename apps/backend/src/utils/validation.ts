import { ValidationError } from '../types/index.js';

export type FieldParser<T = unknown> = (value: unknown, field: string) => T;

export const hasField = (body: Record<string, unknown>, key: string) =>
  Object.prototype.hasOwnProperty.call(body, key);

/**
 * Parse only the fields present in `body` using the given parser map.
 * Fields not present in body are skipped entirely (supports partial updates).
 */
export function parsePartialFields<T>(
  body: Record<string, unknown>,
  parsers: { [K in keyof T]?: FieldParser<T[K]> }
): Partial<T> {
  const result: Partial<T> = {};
  for (const key of Object.keys(parsers) as (keyof T & string)[]) {
    if (hasField(body, key)) {
      result[key] = parsers[key]!(body[key], key);
    }
  }
  return result;
}

export function parseNonEmptyString(value: unknown, field: string) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new ValidationError(`${field} must be a non-empty string`);
  }
  return value.trim();
}

export function parseStringOrNull(value: unknown, field: string) {
  if (value === null) return null;
  if (typeof value !== 'string') {
    throw new ValidationError(`${field} must be a string`);
  }
  return value.trim();
}

export function parsePositiveNumber(value: unknown, field: string) {
  const parsed =
    typeof value === 'number' ? value : typeof value === 'string' && value.trim() ? Number(value) : NaN;
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new ValidationError(`${field} must be a positive number`);
  }
  return parsed;
}

export function parseNullablePositiveNumber(value: unknown, field: string) {
  return value === null ? null : parsePositiveNumber(value, field);
}

export function parseDateValue(value: unknown, field: string) {
  const date = new Date(typeof value === 'string' || value instanceof Date ? value : NaN);
  if (Number.isNaN(date.getTime())) {
    throw new ValidationError(`${field} must be a valid date`);
  }
  return date;
}

export function parseStringArray(value: unknown, field: string) {
  if (!Array.isArray(value) || value.some((item) => typeof item !== 'string')) {
    throw new ValidationError(`${field} must be an array of strings`);
  }
  return value;
}
