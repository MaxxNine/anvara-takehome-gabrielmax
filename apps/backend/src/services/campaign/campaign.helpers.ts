import { CampaignStatus } from '../../db.js';
import {
  ValidationError,
  type CampaignStatusValue,
  type CreateCampaignInput,
  type UpdateCampaignInput,
} from '../../types/index.js';
import {
  hasField,
  parseDateValue,
  parseNonEmptyString,
  parseNullablePositiveNumber,
  parsePartialFields,
  parsePositiveNumber,
  parseStringArray,
  parseStringOrNull,
} from '../../utils/validation.js';

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

export function isCampaignStatus(value: unknown): value is CampaignStatusValue {
  return (
    typeof value === 'string' &&
    Object.values(CampaignStatus).includes(value as CampaignStatusValue)
  );
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
  const data = parsePartialFields<UpdateCampaignInput>(body, {
    name: parseNonEmptyString,
    description: parseStringOrNull,
    budget: parsePositiveNumber,
    cpmRate: parseNullablePositiveNumber,
    cpcRate: parseNullablePositiveNumber,
    startDate: parseDateValue,
    endDate: parseDateValue,
    targetCategories: parseStringArray,
    targetRegions: parseStringArray,
  });

  // Status needs custom transition validation
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
