import { limit, query } from 'firebase/firestore';
import { useCallback, useMemo, useState } from 'react';
import { useDeepCompareEffect } from '~/hooks/react-use';
import { useCollectionData } from './useCollectionData';
import type { Query } from 'firebase/firestore';

export const usePaginatedCollectionData = <T>(
  _query: Query<T>,
  { limit: _limit = 20, defaultPage = 1 }: { limit?: number; defaultPage?: number } = {},
) => {
  const [page, setPage] = useState(defaultPage);
  const [data, setData] = useState<T[]>([]);
  const paginatedQuery = query(_query, limit(_limit * page + 1));
  const { data: _data, status } = useCollectionData(paginatedQuery);
  // NOTE: loadMoreのときに一時的に_dataが空になるので、その間はloadingをtrueにする
  const loading = useMemo(() => status === 'loading' || (page > 1 && _data.length === 0), [status, page, _data.length]);
  const hasMore = data.length > _limit * page;
  const dataWithoutLast = useMemo(() => (hasMore ? data.slice(0, -1) : data), [data, hasMore]);
  const loadMore = useCallback(() => setPage((prev) => prev + 1), []);

  // NOTE: loadMoreのときに一時的に_dataが空になるので、その間はdataを更新しない
  useDeepCompareEffect(() => {
    if (loading) return;
    setData(_data);
  }, [loading, _data]);

  return { data: dataWithoutLast, loading, hasMore, loadMore };
};
