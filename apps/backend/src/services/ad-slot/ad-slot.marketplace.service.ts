import type { Prisma } from '../../generated/prisma/client.js';
import { prisma } from '../../db.js';
import type {
  MarketplaceAdSlotConnection,
  MarketplaceAdSlotFilters,
} from '../../types/index.js';

import {
  applyMarketplaceDerivedFilters,
  buildMarketplaceCatalogMeta,
  marketplaceAdSlotInclude,
  marketplaceCatalogSelect,
  type MarketplaceAdSlotRecord,
} from './ad-slot.marketplace-helpers.js';
import { paginateMarketplaceItems } from './ad-slot.marketplace-pagination.js';

function buildMarketplaceWhere(filters: MarketplaceAdSlotFilters): Prisma.AdSlotWhereInput {
  const query = filters.query?.trim();
  const basePrice =
    filters.price.min !== null || filters.price.max !== null
      ? {
          ...(filters.price.min !== null ? { gte: filters.price.min } : {}),
          ...(filters.price.max !== null ? { lte: filters.price.max } : {}),
        }
      : undefined;

  return {
    ...(filters.publisherId ? { publisherId: filters.publisherId } : {}),
    ...(basePrice ? { basePrice } : {}),
    ...(query
      ? {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
            { publisher: { is: { name: { contains: query, mode: 'insensitive' } } } },
          ],
        }
      : {}),
    ...(filters.type ? { type: filters.type } : {}),
    ...(filters.verifiedOnly ? { publisher: { is: { isVerified: true } } } : {}),
    isAvailable: filters.segment === 'available',
  };
}

export async function listMarketplaceAdSlots(
  filters: MarketplaceAdSlotFilters
): Promise<MarketplaceAdSlotConnection<MarketplaceAdSlotRecord>> {
  const catalogWhere = filters.publisherId ? { publisherId: filters.publisherId } : undefined;
  const [catalogRecords, candidateRecords] = await Promise.all([
    prisma.adSlot.findMany({
      ...(catalogWhere ? { where: catalogWhere } : {}),
      select: marketplaceCatalogSelect,
    }),
    prisma.adSlot.findMany({
      include: marketplaceAdSlotInclude,
      where: buildMarketplaceWhere(filters),
    }),
  ]);

  const catalog = buildMarketplaceCatalogMeta(catalogRecords);
  const filtered = applyMarketplaceDerivedFilters(candidateRecords, filters);
  const paginated = paginateMarketplaceItems(filtered.items, filters.limit, filters.cursor);

  return {
    items: paginated.items,
    meta: {
      catalog,
      missingEstimatedCpmCount: filtered.missingEstimatedCpmCount,
      segment: filters.segment,
    },
    pageInfo: paginated.pageInfo,
  };
}
