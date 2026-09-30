import { FastifyInstance } from "fastify";
import {
  createNewProduct,
  getProduct,
  listProducts,
} from "../controllers/products.controller";
import { authenticate } from "../middlewares/auth.middleware";

export default async function productRoutes(fastify: FastifyInstance) {
  // fastify.addHook("onRequest", authenticate);
  fastify.get(
    "/",
    {
      schema: {
        tags: ["Products"],
        description: "Lista produtos com filtros opcionais",
        querystring: {
          type: "object",
          properties: {
            page: { type: "number" },
            limit: { type: "number" },
            minPrice: { type: "number" },
            maxPrice: { type: "number" },
            search: { type: "string" },
            sortBy: { type: "string", enum: ["price", "name", "createdAt"] },
            sortOrder: { type: "string", enum: ["asc", "desc"] },
          },
        },
      },
    },
    listProducts,
  );

  fastify.get(
    "/:id",
    {
      schema: {
        tags: ["Products"],
        description: "Obtém um produto pelo ID",
        params: {
          type: "object",
          properties: {
            id: { type: "number" },
          },
          required: ["id"],
        },
        response: {
          200: {
            description: "Produto encontrado",
            type: "object",
            properties: {
              id: { type: "number" },
              name: { type: "string" },
              price: { type: "number" },
              createdAt: { type: "string", format: "date-time" },
              color: { type: "string" },
              sizes: {
                type: "array",
                items: { type: "string" },
              },
              stock: { type: "number" },
              slug: { type: "string" },
              description: { type: "string" },
              images: {
                type: "array",
                items: { type: "string" },
              },
              updatedAt: { type: "string", format: "date-time" },
            },
          },
          400: {
            description: "ID inválido",
            type: "object",
            properties: {
              error: { type: "string" },
            },
          },
          401: {
            description: "Não autorizado",
            type: "object",
            properties: {
              error: { type: "string" },
            },
          },
        },
      },
    },
    getProduct,
  );

  fastify.post(
    "/",
    {
      schema: {
        tags: ["Products"],
        description: "Cria um novo produto",
        required: ["name", "description", "price", "slug", "active", "stock"],
        body: {
          type: "object",
          properties: {
            name: { type: "string" },
            description: { type: "string" },
            price: { type: "number" },
            colors: { type: "array", items: { type: "string" } },
            sizes: { type: "array", items: { type: "string" } },
            stock: { type: "number" },
            active: { type: "boolean" },
            images: { type: "array", items: { type: "string" } },
          },
        },
      },
    },
    createNewProduct,
  );
}
