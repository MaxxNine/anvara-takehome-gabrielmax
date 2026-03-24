import { AdSlotType, prisma } from '../db.js';
import type { AdSlotListFilters, AdSlotTypeValue, CreateAdSlotInput } from '../types/index.js';

export function isAdSlotType(value: unknown): value is AdSlotTypeValue {
  return typeof value === 'string' && Object.values(AdSlotType).includes(value as AdSlotTypeValue);
}

export async function listAdSlots(filters: AdSlotListFilters) {
  return prisma.adSlot.findMany({
    where: {
      ...(filters.publisherId && { publisherId: filters.publisherId }),
      ...(filters.type && { type: filters.type }),
      ...(filters.availableOnly && { isAvailable: true }),
    },
    include: {
      publisher: { select: { id: true, name: true, category: true, monthlyViews: true } },
      _count: { select: { placements: true } },
    },
    orderBy: { basePrice: 'desc' },
  });
}

export async function getAdSlotById(id: string) {
  return prisma.adSlot.findUnique({
    where: { id },
    include: {
      publisher: true,
      placements: {
        include: {
          campaign: { select: { id: true, name: true, status: true } },
        },
      },
    },
  });
}

export async function createAdSlot(data: CreateAdSlotInput) {
  return prisma.adSlot.create({
    data,
    include: {
      publisher: { select: { id: true, name: true } },
    },
  });
}

export async function bookAdSlot(id: string) {
  return prisma.adSlot.update({
    where: { id },
    data: { isAvailable: false },
    include: {
      publisher: { select: { id: true, name: true } },
    },
  });
}

export async function unbookAdSlot(id: string) {
  return prisma.adSlot.update({
    where: { id },
    data: { isAvailable: true },
    include: {
      publisher: { select: { id: true, name: true } },
    },
  });
}
