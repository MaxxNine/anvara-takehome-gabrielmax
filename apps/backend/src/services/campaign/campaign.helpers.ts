import { CampaignStatus } from '../../db.js';
import {
  ValidationError,
  type CampaignStatusValue,
  type CreateCampaignInput,
  type UpdateCampaignInput,
} from '../../types/index.js';

interface CampaignValidationContext {
  endDate: Date;
  startDate: Date;
  status: CampaignStatusValue;
}

const ALLOWED_CAMPAIGN_STATUS_TRANSITIONS: Record<CampaignStatusValue, CampaignStatusValue[]> = {
  DRAFT: ['DRAFT', 'PENDING_REVIEW', 'APPROVED', 'ACTIVE', 'CANCELLED'],
  PENDING_REVIEW: ['PENDING_REVIEW', 'DRAFT', 'APPROVED', 'CANCELLED'],
  APPROVED: ['APPROVED', 'ACTIVE', 'CANCELLED'],
  ACTIVE: ['ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED'],
  PAUSED: ['PAUSED', 'ACTIVE', 'COMPLETED', 'CANCELLED'],
  COMPLETED: ['COMPLETED'],
  CANCELLED: ['CANCELLED'],
};

const hasField = (body: Record<string, unknown>, key: string) =>
  Object.prototype.hasOwnProperty.call(body, key);

export function isCampaignStatus(value: unknown): value is CampaignStatusValue {
  return (
    typeof value === 'string' &&
    Object.values(CampaignStatus).includes(value as CampaignStatusValue)
  );
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

function parseDateValue(value: unknown, field: string) {
  const date = new Date(typeof value === 'string' || value instanceof Date ? value : NaN);
  if (Number.isNaN(date.getTime())) {
    throw new ValidationError(`${field} must be a valid date`);
  }
  return date;
}

function parseStringArray(value: unknown, field: string) {
  if (!Array.isArray(value) || value.some((item) => typeof item !== 'string')) {
    throw new ValidationError(`${field} must be an array of strings`);
  }
  return value;
}

function assertDateRange(startDate: Date, endDate: Date) {
  if (endDate < startDate) {
    throw new ValidationError('endDate must be on or after startDate');
  }
}

function assertCampaignStatusTransition(current: CampaignStatusValue, next: CampaignStatusValue) {
  if (!ALLOWED_CAMPAIGN_STATUS_TRANSITIONS[current].includes(next)) {
    throw new ValidationError(`Cannot change campaign status from ${current} to ${next}`);
  }
}

export function buildCreateCampaignInput(
  body: Record<string, unknown>,
  sponsorId: string
): CreateCampaignInput {
  const startDate = parseDateValue(body.startDate, 'startDate');
  const endDate = parseDateValue(body.endDate, 'endDate');
  assertDateRange(startDate, endDate);

  return {
    name: parseNonEmptyString(body.name, 'name'),
    ...(hasField(body, 'description') && {
      description: parseStringOrNull(body.description, 'description') ?? undefined,
    }),
    budget: parsePositiveNumber(body.budget, 'budget'),
    ...(hasField(body, 'cpmRate') && { cpmRate: parsePositiveNumber(body.cpmRate, 'cpmRate') }),
    ...(hasField(body, 'cpcRate') && { cpcRate: parsePositiveNumber(body.cpcRate, 'cpcRate') }),
    startDate,
    endDate,
    targetCategories: hasField(body, 'targetCategories')
      ? parseStringArray(body.targetCategories, 'targetCategories')
      : [],
    targetRegions: hasField(body, 'targetRegions')
      ? parseStringArray(body.targetRegions, 'targetRegions')
      : [],
    sponsorId,
  };
}

export function buildUpdateCampaignInput(
  body: Record<string, unknown>,
  current: CampaignValidationContext
): UpdateCampaignInput {
  const data: UpdateCampaignInput = {};

  if (hasField(body, 'name')) data.name = parseNonEmptyString(body.name, 'name');
  if (hasField(body, 'description')) data.description = parseStringOrNull(body.description, 'description');
  if (hasField(body, 'budget')) data.budget = parsePositiveNumber(body.budget, 'budget');
  if (hasField(body, 'cpmRate')) data.cpmRate = body.cpmRate === null ? null : parsePositiveNumber(body.cpmRate, 'cpmRate');
  if (hasField(body, 'cpcRate')) data.cpcRate = body.cpcRate === null ? null : parsePositiveNumber(body.cpcRate, 'cpcRate');
  if (hasField(body, 'startDate')) data.startDate = parseDateValue(body.startDate, 'startDate');
  if (hasField(body, 'endDate')) data.endDate = parseDateValue(body.endDate, 'endDate');
  if (hasField(body, 'targetCategories')) data.targetCategories = parseStringArray(body.targetCategories, 'targetCategories');
  if (hasField(body, 'targetRegions')) data.targetRegions = parseStringArray(body.targetRegions, 'targetRegions');
  if (hasField(body, 'status')) {
    if (!isCampaignStatus(body.status)) {
      throw new ValidationError('status must be a valid campaign status');
    }
    assertCampaignStatusTransition(current.status, body.status);
    data.status = body.status;
  }

  if (Object.keys(data).length === 0) {
    throw new ValidationError('At least one campaign field must be provided');
  }

  assertDateRange(data.startDate ?? current.startDate, data.endDate ?? current.endDate);
  return data;
}
