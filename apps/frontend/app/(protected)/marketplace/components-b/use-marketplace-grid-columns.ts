'use client';

import { type RefObject, useEffect, useState } from 'react';

function getColumns(width: number): number {
  if (width >= 1280) {
    return 3;
  }

  if (width >= 768) {
    return 2;
  }

  return 1;
}

export function useMarketplaceGridColumns(
  containerRef: RefObject<HTMLElement | null>
): number {
  const [columns, setColumns] = useState(1);

  useEffect(() => {
    const element = containerRef.current;

    if (!element || typeof ResizeObserver === 'undefined') {
      return;
    }

    const updateColumns = (width: number) => {
      setColumns((current) => {
        const next = getColumns(width);

        return current === next ? current : next;
      });
    };

    updateColumns(element.getBoundingClientRect().width);

    const observer = new ResizeObserver((entries) => {
      const [entry] = entries;

      if (entry) {
        updateColumns(entry.contentRect.width);
      }
    });

    observer.observe(element);

    return () => observer.disconnect();
  }, [containerRef]);

  return columns;
}
