import { prisma } from "../utils/prisma";
import { CreateProduct, ProductFilters, UpdateProduct } from "../types";
import { Prisma } from "@prisma/client";
import { ConflictError } from "../../src/utils/errors";

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

export const getProductById = async (id: number) => {
  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    throw new Error("Produto não encontrado");
  }

  return product;
};

export const createProduct = async (data: CreateProduct) => {
  const existingProduct = await prisma.product.findUnique({
    where: { slug: data.slug },
  });

  if (existingProduct) {
    throw new Error(
      "Produto com este slug já existe. Escolha outro nome para o produto.",
    );
  }

  const newProduct = await prisma.product.create({
    data,
  });
  return newProduct;
};

export const updateProduct = async (id: number, data: UpdateProduct) => {
  const existingProduct = await prisma.product.findUnique({
    where: { id },
  });

  if (!existingProduct) {
    throw new Error("Produto não encontrado");
  }

  if (data.name) {
    const productWithSameName = await prisma.product.findFirst({
      where: {
        name: { equals: data.name.trim(), mode: "insensitive" },
        id: { not: id },
      },
    });

    if (productWithSameName) {
      throw new ConflictError("Já existe um produto com este nome.");
    }
  }

  if (data.slug) {
    const slugExists = await prisma.product.findUnique({
      where: { slug: data.slug },
    });

    if (slugExists && slugExists.id !== id) {
      throw new ConflictError(
        "Produto com este slug já existe. Escolha outro nome para o produto.",
      );
    }
  }

  const updatedProduct = await prisma.product.update({
    where: { id },
    data,
  });
  return updatedProduct;
};
