import { FastifyReply, FastifyRequest } from "fastify";
import {
  getCategories as listCategories,
  getCategoryById as findCategoryById,
} from "../services/categories.service";
import { CategoryFilters } from "../types";
import { categoryFiltersSchema } from "../utils/validators";

export const getCategories = async (
  request: FastifyRequest<{ Querystring: CategoryFilters }>,
  reply: FastifyReply,
) => {
  const filters = categoryFiltersSchema.parse(request.query);
  const categories = await listCategories(filters);
  reply.status(200).send(categories);
};

export const getCategoryById = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) => {
  const category = await findCategoryById(Number(request.params.id));
  reply.status(200).send(category);
};
