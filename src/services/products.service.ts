import { prisma } from "../utils/prisma";
import { ProductFilters } from "../types";
import { Prisma } from "@prisma/client";

export const getProducts = async (filter: ProductFilters) => {
  const {
    page = 1,
    limit = 20,
    minPrice,
    maxPrice,
    search,
    sortBy = "name",
    sortOrder = "asc",
  } = filter;

  const safePage = Math.max(1, page);
  const safeLimit = Math.min(100, Math.max(1, limit));
  const where: Prisma.ProductWhereInput = {};

  if (minPrice !== undefined) {
    where.price = {};
    where.price.gte = minPrice;
  }
  if (maxPrice !== undefined) {
    where.price = {
      ...(typeof where.price === "object" ? where.price : {}),
      lte: maxPrice,
    };
  }
  if (search?.trim()) {
    where.name = {
      contains: search.trim(),
      mode: "insensitive",
    };
  }

  const result = await prisma.product.findMany({
    where,
    orderBy: { [sortBy]: sortOrder },
    skip: (safePage - 1) * safeLimit,
    take: safeLimit,
  });

  return result;
};
