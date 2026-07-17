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

export const buildQuery = ({
  reqQuery,
  priceField = "price",
  allowedSortFields = ["price", "name", "en_name", "createdAt"],
  defaultSort = ["createdAt", "DESC"],
  extraWhere = {},
  searchFields = ["en_name", "ar_name", "fr_name"],
}: BuildQueryParams): QueryOptions => {
  const where: any = { ...extraWhere };

  let page = 1;
  let limit = 10;
  let sort: string | undefined;

  if (reqQuery.page !== undefined) {
    const n = Number(reqQuery.page);
    if (!Number.isInteger(n) || n < 1) {
      throw new Error("page must be a positive integer");
    }
    page = n;
  }

  if (reqQuery.limit !== undefined) {
    const n = Number(reqQuery.limit);
    if (!Number.isInteger(n) || n < 1 || n > 100) {
      throw new Error("limit must be an integer between 1 and 100");
    }
    limit = n;
  }

  const offset = (page - 1) * limit;

  if (reqQuery.minPrice !== undefined || reqQuery.maxPrice !== undefined) {
    const minPrice =
      reqQuery.minPrice !== undefined ? Number(reqQuery.minPrice) : undefined;
    const maxPrice =
      reqQuery.maxPrice !== undefined ? Number(reqQuery.maxPrice) : undefined;

    if (minPrice !== undefined && (isNaN(minPrice) || minPrice < 0)) {
      throw new Error("minPrice must be a non-negative number");
    }
    if (maxPrice !== undefined && (isNaN(maxPrice) || maxPrice < 0)) {
      throw new Error("maxPrice must be a non-negative number");
    }
    if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice) {
      throw new Error("minPrice cannot be greater than maxPrice");
    }

    where[priceField] = {};
    if (minPrice !== undefined) where[priceField].$gte = minPrice;
    if (maxPrice !== undefined) where[priceField].$lte = maxPrice;
  }

  if (reqQuery.search !== undefined) {
    const search = String(reqQuery.search).trim();
    if (search) {
      const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(escaped, "i");
      where.$or = searchFields.map((field) => ({ [field]: regex }));
    }
  }

  if (reqQuery.sort !== undefined) {
    sort = String(reqQuery.sort);
    const parts = sort.split("_");
    const field = parts.slice(0, -1).join("_");
    const dir = parts[parts.length - 1];
    if (!allowedSortFields.includes(field) || (dir !== "asc" && dir !== "desc")) {
      throw new Error(`sort must be in format {${allowedSortFields.join(",")}}_{asc,desc}`);
    }
  }

  let order: Record<string, 1 | -1> = { [defaultSort[0]]: defaultSort[1] === "DESC" ? -1 : 1 };
  if (sort) {
    const parts = sort.split("_");
    const field = parts.slice(0, -1).join("_");
    const dir = parts[parts.length - 1];
    order = { [field]: dir === "desc" ? -1 : 1 };
  }

  return { where, order, offset, limit, page };
};
