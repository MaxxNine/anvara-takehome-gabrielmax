// Utility helpers for the API

// Helper to safely extract route/query params
export function getParam(param: unknown): string | undefined {
  if (typeof param === 'string') {
    const value = param.trim();
    return value.length > 0 ? value : undefined;
  }

  if (Array.isArray(param) && typeof param[0] === 'string') {
    const value = param[0].trim();
    return value.length > 0 ? value : undefined;
  }

  return undefined;
}

// Helper to format currency values
export function formatCurrency(amount: number, currency = 'USD'): string {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  });
  return formatter.format(amount);
}

// Helper to calculate percentage change
export function calculatePercentChange(oldValue: number, newValue: number): number {
  if (oldValue === 0) return newValue > 0 ? 100 : 0;
  return ((newValue - oldValue) / oldValue) * 100;
}

// Parse pagination params from query
export function parsePagination(query: { page?: string | number; limit?: string | number }): {
  page: number;
  limit: number;
  skip: number;
} {
  const page = Number.parseInt(String(query.page ?? ''), 10) || 1;
  const limit = Number.parseInt(String(query.limit ?? ''), 10) || 10;
  const skip = (page - 1) * limit;

  return { page, limit, skip };
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Helper to build filter object from query params
export const buildFilters = (
  query: Record<string, unknown>,
  allowedFields: string[]
): Record<string, unknown> => {
  const filters: Record<string, unknown> = {};

  for (const field of allowedFields) {
    if (query[field] !== undefined) {
      filters[field] = query[field];
    }
  }

  return filters;
};

/** @deprecated Legacy config kept for compatibility with older callers. */
export const DEPRECATED_CONFIG = {
  apiVersion: 'v1',
  timeout: 5000,
};

export function clampValue(value: number, min: number, max: number): number {
  const lowerBound = Math.min(min, max);
  const upperBound = Math.max(min, max);
  return Math.max(lowerBound, Math.min(upperBound, value));
}

export function formatDate(date: string | number | Date): string {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return 'Invalid date';
  }

  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(parsedDate);
}
