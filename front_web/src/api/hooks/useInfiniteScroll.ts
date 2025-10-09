// hooks/useInfiniteScroll.ts
import { useState, useEffect, useCallback } from 'react';

interface PaginatedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
}

type IdSelector<T> = (item: T) => number | string | undefined;

export function useInfiniteScroll<T>(
  fetchFn: (page: number, size: number) => Promise<PaginatedResponse<T>>,
  size: number = 10,
  options?: { idField?: string; idSelector?: IdSelector<T> }
) {
  const [items, setItems] = useState<T[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // selector por defecto (busca options.idField o 'id')
  const idSel: IdSelector<T> = options?.idSelector ?? ((item: any) => {
    if (options?.idField) return (item as any)[options.idField];
    return (item as any).id;
  });

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const currentPage = page;
      const data = await fetchFn(currentPage, size);

      setItems(prevItems => {
        const newItems = data.content.filter(e => {
          const eid = idSel(e);
          // si no hay id, lo dejamos pasar (no lo deduplicamos)
          if (eid === undefined || eid === null) return true;
          return !prevItems.some(p => idSel(p) === eid);
        });
        return [...prevItems, ...newItems];
      });

      setPage(prev => prev + 1);
      setHasMore(currentPage + 1 < data.totalPages);
    } catch (err) {
      console.error(err);
      setError('Error cargando datos');
    } finally {
      setLoading(false);
    }
  }, [page, size, hasMore, loading, fetchFn, idSel]);

  // Primer carga
  useEffect(() => {
    loadMore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { items, hasMore, loading, error, loadMore, setItems, setPage, setHasMore };
}
