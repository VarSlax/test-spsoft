import { useCallback, useEffect, useState } from "react";

export const usePaginatedFetcher = <TFetchedData, TResponse>({
  endpoint,
  queryParams = {},
  paginationType = "limit-skip",
  dataMapper,
  perPage = 10,
  initialPage = 1,
}: {
  endpoint: string;
  queryParams?: Record<string, string | number>;
  paginationType?: "limit-skip" | "page-limit";
  dataMapper: (data: TResponse) => TFetchedData[];
  perPage: number;
  initialPage: number;
}) => {
  const [initialLoader, setInitialLoader] = useState(true);
  const [data, setData] = useState<TFetchedData[]>([]);
  const [totalResult, setTotalResult] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);

  const fetchData = async (page: number, resetData = false) => {
    try {
      const paginationParams =
        paginationType === "limit-skip"
          ? {
              limit: perPage.toString(),
              skip: ((page - 1) * perPage).toString(),
            }
          : { _page: page.toString(), _limit: perPage.toString() };

      const params = new URLSearchParams(
        Object.entries({
          ...queryParams,
          ...paginationParams,
        }).map(([key, value]) => [key, String(value)]),
      );

      const response = await fetch(`${endpoint}?${params.toString()}`);
      const rawData: TResponse = await response.json();

      const mappedData = dataMapper(rawData);
      const totalItems = parseInt(
        response.headers.get("X-Total-Count") || "100",
        10,
      );
      const totalPagesCount = Math.ceil(totalItems / perPage);

      setData((prevData) =>
        resetData ? mappedData : [...prevData, ...mappedData],
      );
      setTotalResult(totalItems);
      setCurrentPage(page);
      setTotalPages(totalPagesCount);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setRefreshing(false);
      setLoadingMore(false);
      setInitialLoader(false);
    }
  };

  useEffect(() => {
    fetchData(initialPage, true);
  }, [initialPage]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData(1, true);
  }, [endpoint, JSON.stringify(queryParams)]);

  const loadMore = () => {
    if (!loadingMore && currentPage < totalPages) {
      setLoadingMore(true);
      fetchData(currentPage + 1);
    }
  };

  return {
    data,
    totalResult,
    refreshing,
    loadingMore,
    currentPage,
    handleRefresh,
    loadMore,
    initialLoader,
  };
};
