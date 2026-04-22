export const getPagination = (totalItems: number, currentPage: number, pageSize: number) => {
  const totalPages = Math.ceil(totalItems / pageSize);
  return {
    totalItems,
    currentPage,
    pageSize,
    totalPages,
    hasPreviousPage: currentPage > 1,
    hasNextPage: currentPage < totalPages,
  };
};
