import type { AdSlotType } from '../db.js';

export type AdSlotTypeValue = (typeof AdSlotType)[keyof typeof AdSlotType];

export interface AdSlotListFilters {
  publisherId?: string;
  type?: AdSlotTypeValue;
  availableOnly?: boolean;
}

export interface CreateAdSlotInput {
  name: string;
  description?: string;
  type: AdSlotTypeValue;
  basePrice: number;
  publisherId: string;
  width?: number;
  height?: number;
}
