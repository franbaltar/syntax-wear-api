import { FastifyReply, FastifyRequest } from "fastify";
import { ProductFilters } from "../types";
import { getProductById, getProducts } from "../services/products.service";

export const listProducts = async (
  request: FastifyRequest<{ Querystring: ProductFilters }>,
  reply: FastifyReply,
) => {
  const result = await getProducts(request.query);
  reply.status(200).send(result);
};

export const getProduct = async (
  request: FastifyRequest<{ Params: { id: number } }>,
  reply: FastifyReply,
) => {
  const product = await getProductById(request.params.id);
  reply.status(200).send(product);
};
