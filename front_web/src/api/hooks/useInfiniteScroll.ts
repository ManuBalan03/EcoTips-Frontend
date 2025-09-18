// hooks/useInfiniteScroll.ts
import { useState, useEffect, useCallback } from 'react';

interface PaginatedResponse<T> {
  content: T[];          // Lista de items (ajusta al nombre que use tu backend)
  totalPages: number;    // Total de páginas disponibles
  totalElements: number; // Total de registros
}
export function useInfiniteScroll<T extends { id: number }>(
  fetchFn: (page: number, size: number) => Promise<PaginatedResponse<T>>, 
  size: number = 10
) {
  const [items, setItems] = useState<T[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const currentPage = page;
      const data = await fetchFn(currentPage, size);

      setItems(prevItems => {
        const newItems = data.content.filter(
          e => !prevItems.some(p => p.id === e.id)
        );
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
  }, [page, size, hasMore, loading, fetchFn]);

  // Primer carga
  useEffect(() => {
    loadMore();
  }, []);

  return { items, hasMore, loading, error, loadMore };
}
