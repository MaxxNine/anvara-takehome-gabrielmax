import { prisma } from '../../db.js';
import type {
  AdSlotListFilters,
  CreateAdSlotInput,
  UpdateAdSlotInput,
} from '../../types/index.js';

export {
  buildCreateAdSlotInput,
  buildUpdateAdSlotInput,
  isAdSlotType,
} from './ad-slot.helpers.js';

const adSlotSummaryInclude = {
  publisher: { select: { id: true, name: true } },
};

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
    include: adSlotSummaryInclude,
  });
}

export async function updateAdSlot(id: string, data: UpdateAdSlotInput) {
  return prisma.adSlot.update({
    where: { id },
    data,
    include: adSlotSummaryInclude,
  });
}

export async function deleteAdSlot(id: string) {
  await prisma.adSlot.delete({
    where: { id },
  });
}

export async function bookAdSlot(id: string) {
  return prisma.adSlot.update({
    where: { id },
    data: { isAvailable: false },
    include: adSlotSummaryInclude,
  });
}

export async function unbookAdSlot(id: string) {
  return prisma.adSlot.update({
    where: { id },
    data: { isAvailable: true },
    include: adSlotSummaryInclude,
  });
}
