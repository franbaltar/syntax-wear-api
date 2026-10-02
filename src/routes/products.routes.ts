import { FastifyInstance } from "fastify";
import {
  createNewProduct,
  deleteExistingProduct,
  getProduct,
  listProducts,
  updateExistingProduct,
} from "../controllers/products.controller";
import { authenticate } from "../middlewares/auth.middleware";

export default async function productRoutes(fastify: FastifyInstance) {
  fastify.addHook("onRequest", authenticate);
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

  fastify.put(
    "/:id",
    {
      schema: {
        tags: ["Products"],
        description: "Atualiza um produto pelo ID",
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
        response: {
          200: {
            description: "Produto atualizado com sucesso",
            type: "object",
            properties: {
              id: { type: "integer" },
              name: { type: "string" },
              slug: { type: "string" },
              description: { type: "string", nullable: true },
              price: { type: "number" },
              sku: { type: "string", nullable: true },
              images: { type: "array", items: { type: "string" } },
              colors: { type: "array", items: { type: "string" } },
              sizes: {},
              stock: { type: "integer" },
              active: { type: "boolean" },
            },
          },
          400: {
            description: "Erro de validação",
            type: "object",
            properties: {
              message: { type: "string" },
              errors: {
                anyOf: [
                  { type: "object", additionalProperties: true },
                  {
                    type: "array",
                    items: { type: "object", additionalProperties: true },
                  },
                ],
              },
            },
            required: ["message", "errors"],
          },
          409: {
            description: "Já existe um produto com este nome ou slug",
            type: "object",
            properties: {
              message: { type: "string" },
            },
            required: ["message"],
          },
          500: {
            description: "Erro interno do servidor",
            type: "object",
            properties: {
              message: { type: "string" },
              debug: { type: "string" },
            },
            required: ["message", "debug"],
          },
        },
      },
    },
    updateExistingProduct,
  );

  fastify.delete(
    "/:id",
    {
      schema: {
        tags: ["Products"],
        description: "Deleta um produto pelo ID",
        params: {
          type: "object",
          properties: {
            id: { type: "number" },
          },
          required: ["id"],
        },
        response: {
          200: {
            description: "Produto deletado com sucesso",
            type: "object",
            properties: {
              message: { type: "string" },
            },
            required: ["message"],
          },
        },
      },
    },
    deleteExistingProduct,
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
