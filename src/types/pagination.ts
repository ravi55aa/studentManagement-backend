export type TPaginationQuery = {
    page: number;
    limit: number;
};

export type TPaginationResult<T> = {
    data: T[];
    total: number;
    page: number;
    totalPages: number;
} ;