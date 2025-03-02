"use client";
import { usePaginatedFetcher } from "../_hooks/usePaginatedFetcher";

type Product = {
  id: number;
  title: string;
  category: string;
  price: number;
};

const mapProducts = (response: { products: Product[] }) =>
  response.products || [];

export const PaginationList = () => {
  const {
    data,
    totalResult,
    loadMore,
    handleRefresh,
    initialLoader,
    refreshing,
    currentPage,
    loadingMore,
  } = usePaginatedFetcher<Product, { products: Product[] }>({
    endpoint: "https://dummyjson.com/products",
    queryParams: {},
    paginationType: "limit-skip",
    dataMapper: mapProducts,
    perPage: 10,
    initialPage: 3,
  });

  if (initialLoader) {
    return <div className="loader">Loading...</div>;
  }

  return (
    <div className="rounded-lg border border-gray-300 p-4">
      <div className="mb-4">
        {data.map((item) => (
          <div
            className="mb-4 rounded-lg border border-gray-300 p-4"
            key={item.id}
          >
            <h3 className="uppercase">{item.category || "Unknown"}</h3>
            <p>{item.title}</p>
            <p>{item.price ? `${item.price}$` : "N/A"}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="mr-4 text-yellow-500">
          {data.length} of {totalResult} items Page: {currentPage}
        </span>

        <div className="flex space-x-4">
          {!loadingMore && data.length >= 10 && (
            <button
              onClick={loadMore}
              className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              Load More
            </button>
          )}

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="rounded-md bg-green-500 px-4 py-2 text-white hover:bg-green-600 disabled:bg-gray-400"
          >
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>
    </div>
  );
};
