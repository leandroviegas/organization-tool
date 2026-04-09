import { t, Static } from "elysia";

export const paginationSchema = t.Object({
  page: t.Optional(t.Numeric({ default: 1, minimum: 1 })),
  perPage: t.Optional(t.Numeric({ default: 20, minimum: 1 })),
  search: t.Optional(t.String({ default: "" })),
});

export type PaginationType = Static<typeof paginationSchema>;

export const metaSchema = t.Object({
  currentPage: t.Integer(),
  isFirstPage: t.Boolean(),
  isLastPage: t.Boolean(),
  previousPage: t.Union([t.Integer(), t.Null()]),
  nextPage: t.Union([t.Integer(), t.Null()]),
  pageCount: t.Integer(),
  totalCount: t.Integer(),
});
