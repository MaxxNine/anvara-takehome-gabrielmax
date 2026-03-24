import { AdSlotType } from '../../db.js';
import {
  ValidationError,
  type AdSlotTypeValue,
  type CreateAdSlotInput,
  type UpdateAdSlotInput,
} from '../../types/index.js';
import {
  hasField,
  parseNonEmptyString,
  parsePartialFields,
  parsePositiveNumber,
  parseStringOrNull,
} from '../../utils/validation.js';

export function isAdSlotType(value: unknown): value is AdSlotTypeValue {
  return typeof value === 'string' && Object.values(AdSlotType).includes(value as AdSlotTypeValue);
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

function parseNullableDimension(value: unknown, field: string) {
  return value === null ? null : parseDimension(value, field);
}

export function buildUpdateAdSlotInput(body: Record<string, unknown>): UpdateAdSlotInput {
  const data = parsePartialFields<UpdateAdSlotInput>(body, {
    name: parseNonEmptyString,
    description: parseStringOrNull,
    basePrice: parsePositiveNumber,
    width: parseNullableDimension,
    height: parseNullableDimension,
  });

  // Type needs enum validation
  if (hasField(body, 'type')) {
    if (!isAdSlotType(body.type)) {
      throw new ValidationError('type must be a valid ad slot type');
    }
    data.type = body.type;
  }

  if (Object.keys(data).length === 0) {
    throw new ValidationError('At least one ad slot field must be provided');
  }

  return data;
}
