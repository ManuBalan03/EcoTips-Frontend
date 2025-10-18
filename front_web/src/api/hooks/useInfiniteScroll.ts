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

  const idSel: IdSelector<T> = options?.idSelector ?? ((item: any) => {
    if (options?.idField) return (item as any)[options.idField];
    return (item as any).id;
  });

  const loadMore = useCallback(async (resetting: boolean = false) => {
    if (loading) return;

    setLoading(true);
    try {
      // Si estamos reseteando, forzamos page = 0
      const currentPage = resetting ? 0 : page;
      const data = await fetchFn(currentPage, size);

      setItems(prevItems => {
        if (resetting) return data.content; // reemplaza todo
        const newItems = data.content.filter(e => {
          const eid = idSel(e);
          if (eid === undefined || eid === null) return true;
          return !prevItems.some(p => idSel(p) === eid);
        });
        return [...prevItems, ...newItems];
      });

      setPage(currentPage + 1);
      setHasMore(currentPage + 1 < data.totalPages);
    } catch (err) {
      console.error(err);
      setError('Error cargando datos');
    } finally {
      setLoading(false);
    }
  }, [page, size, loading, fetchFn, idSel]);

  // 🔁 Nueva función refresh estable
  const refresh = useCallback(async () => {
    setItems([]);
    setPage(0);
    setHasMore(true);
    await loadMore(true); // true = reiniciar desde 0
  }, [loadMore]);

  useEffect(() => {
    loadMore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { items, hasMore, loading, error, loadMore, refresh };
}
