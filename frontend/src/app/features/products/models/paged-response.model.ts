export interface PagedMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PagedResponse<T> {
  items: T[];
  meta?: PagedMeta;
}