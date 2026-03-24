import { AdSlotType } from '../../db.js';
import {
  ValidationError,
  type AdSlotTypeValue,
  type CreateAdSlotInput,
  type UpdateAdSlotInput,
} from '../../types/index.js';

const hasField = (body: Record<string, unknown>, key: string) =>
  Object.prototype.hasOwnProperty.call(body, key);

export function isAdSlotType(value: unknown): value is AdSlotTypeValue {
  return typeof value === 'string' && Object.values(AdSlotType).includes(value as AdSlotTypeValue);
}

function parseNonEmptyString(value: unknown, field: string) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new ValidationError(`${field} must be a non-empty string`);
  }
  return value.trim();
}

function parseStringOrNull(value: unknown, field: string) {
  if (value === null) return null;
  if (typeof value !== 'string') {
    throw new ValidationError(`${field} must be a string`);
  }
  return value.trim();
}

function parsePositiveNumber(value: unknown, field: string) {
  const parsed =
    typeof value === 'number' ? value : typeof value === 'string' && value.trim() ? Number(value) : NaN;
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new ValidationError(`${field} must be a positive number`);
  }
  return parsed;
}

function parseDimension(value: unknown, field: string) {
  const parsed = parsePositiveNumber(value, field);
  if (!Number.isInteger(parsed)) {
    throw new ValidationError(`${field} must be a positive integer`);
  }
  return parsed;
}

export function buildCreateAdSlotInput(
  body: Record<string, unknown>,
  publisherId: string
): CreateAdSlotInput {
  if (!isAdSlotType(body.type)) {
    throw new ValidationError('type must be a valid ad slot type');
  }

  return {
    name: parseNonEmptyString(body.name, 'name'),
    ...(hasField(body, 'description') && {
      description: parseStringOrNull(body.description, 'description') ?? undefined,
    }),
    type: body.type,
    basePrice: parsePositiveNumber(body.basePrice, 'basePrice'),
    ...(hasField(body, 'width') && { width: parseDimension(body.width, 'width') }),
    ...(hasField(body, 'height') && { height: parseDimension(body.height, 'height') }),
    publisherId,
  };
}

export function buildUpdateAdSlotInput(body: Record<string, unknown>): UpdateAdSlotInput {
  const data: UpdateAdSlotInput = {};

  if (hasField(body, 'name')) data.name = parseNonEmptyString(body.name, 'name');
  if (hasField(body, 'description')) data.description = parseStringOrNull(body.description, 'description');
  if (hasField(body, 'type')) {
    if (!isAdSlotType(body.type)) {
      throw new ValidationError('type must be a valid ad slot type');
    }
    data.type = body.type;
  }
  if (hasField(body, 'basePrice')) data.basePrice = parsePositiveNumber(body.basePrice, 'basePrice');
  if (hasField(body, 'width')) data.width = body.width === null ? null : parseDimension(body.width, 'width');
  if (hasField(body, 'height')) data.height = body.height === null ? null : parseDimension(body.height, 'height');

  if (Object.keys(data).length === 0) {
    throw new ValidationError('At least one ad slot field must be provided');
  }

  return data;
}
