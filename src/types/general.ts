export type OrderBy = {
  field: string;
  direction: "asc" | "desc";
};

export type PaginationProps = {
  take: number;
  skip: number;
  orderBy?: OrderBy;
};

export type PaginationInput = {
  page?: number;
  pageSize?: number;
};
