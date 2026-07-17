/** Builds Mongoose query options (filter, sort, pagination) from request query params. */
interface QueryOptions {
    where: any;
    order: Record<string, 1 | -1>;
    offset: number;
    limit: number;
    page: number;
}
interface BuildQueryParams {
    reqQuery: any;
    priceField?: string;
    allowedSortFields?: string[];
    defaultSort?: string[];
    extraWhere?: any;
    searchFields?: string[];
}
export declare const buildQuery: ({ reqQuery, priceField, allowedSortFields, defaultSort, extraWhere, searchFields, }: BuildQueryParams) => QueryOptions;
export {};
//# sourceMappingURL=buildQuery.d.ts.map