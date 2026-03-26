import { ValidationError, type MarketplaceConnectionPageInfo } from '../../types/index.js';

export function paginateMarketplaceItems<T extends { id: string }>(
  items: T[],
  limit: number,
  cursor?: string
): { items: T[]; pageInfo: MarketplaceConnectionPageInfo } {
  let startIndex = 0;

  if (cursor) {
    const cursorId = decodeMarketplaceCursor(cursor);
    const cursorIndex = items.findIndex((item) => item.id === cursorId);

    if (cursorIndex < 0) throw new ValidationError('Invalid marketplace cursor');
    startIndex = cursorIndex + 1;
  }

  const pageItems = items.slice(startIndex, startIndex + limit);
  const lastItem = pageItems.at(-1);
  const nextCursor =
    lastItem && startIndex + limit < items.length ? encodeMarketplaceCursor(lastItem.id) : null;

  return {
    items: pageItems,
    pageInfo: {
      hasNextPage: nextCursor !== null,
      limit,
      nextCursor,
      totalCount: items.length,
    },
  };
}

export function encodeMarketplaceCursor(id: string): string {
  return Buffer.from(id, 'utf8').toString('base64url');
}

export function decodeMarketplaceCursor(cursor: string): string {
  try {
    const decoded = Buffer.from(cursor, 'base64url').toString('utf8').trim();
    if (!decoded) throw new Error('empty');
    return decoded;
  } catch {
    throw new ValidationError('Invalid marketplace cursor');
  }
}
