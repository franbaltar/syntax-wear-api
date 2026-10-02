import { prisma } from "../utils/prisma";
import { Prisma } from "@prisma/client";
import { CategoryFilters } from "../types";

export const getCategories = async (filters: CategoryFilters) => {
  const page = Math.max(1, filters.page ?? 1);
  const limit = Math.min(100, Math.max(1, filters.limit ?? 10));
  const where: Prisma.CategoryWhereInput = { active: true };

  if (filters.search?.trim()) {
    where.name = {
      contains: filters.search.trim(),
      mode: "insensitive",
    };
  }

  const [categories, total] = await Promise.all([
    prisma.category.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { name: "asc" },
    }),
    prisma.category.count({ where }),
  ]);

  return {
    data: categories,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

export const getCategoryById = async (id: number) => {
  const category = await prisma.category.findUnique({
    where: { id },
  });

  if (!category) {
    throw new Error("Categoria não encontrada");
  }

  return category;
};
