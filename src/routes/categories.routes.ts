import { FastifyInstance } from "fastify";
import {
  getCategories,
  getCategoryById,
} from "../controllers/categories.controller";
import { authenticate } from "../middlewares/auth.middleware";

export default async function categoriesRoutes(fastify: FastifyInstance) {
  fastify.get(
    "/",
    {
      schema: {
        tags: ["Categories"],
        description: "Lista categorias com busca e paginação opcionais",
        querystring: {
          type: "object",
          properties: {
            page: { type: "integer", minimum: 1 },
            limit: { type: "integer", minimum: 1, maximum: 100 },
            search: { type: "string" },
          },
        },
        response: {
          200: {
            type: "object",
            properties: {
              data: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "integer" },
                    name: { type: "string" },
                    slug: { type: "string" },
                    description: { type: "string", nullable: true },
                    active: { type: "boolean" },
                    createdAt: { type: "string", format: "date-time" },
                    updatedAt: { type: "string", format: "date-time" },
                  },
                  required: [
                    "id",
                    "name",
                    "slug",
                    "active",
                    "createdAt",
                    "updatedAt",
                  ],
                },
              },
              total: { type: "integer" },
              page: { type: "integer" },
              limit: { type: "integer" },
              totalPages: { type: "integer" },
            },
          },
        },
      },
    },
    getCategories,
  );

  fastify.get<{ Params: { id: string } }>(
    "/:id",
    {
      preHandler: authenticate,
      schema: {
        tags: ["Categories"],
        description: "Obtém uma categoria pelo ID",
        security: [{ bearerAuth: [] }],
        params: {
          type: "object",
          properties: {
            id: { type: "integer", minimum: 1 },
          },
          required: ["id"],
        },
        response: {
          200: {
            type: "object",
            properties: {
              id: { type: "integer" },
              name: { type: "string" },
              slug: { type: "string" },
              description: { type: "string", nullable: true },
              active: { type: "boolean" },
              createdAt: { type: "string", format: "date-time" },
              updatedAt: { type: "string", format: "date-time" },
            },
            required: [
              "id",
              "name",
              "slug",
              "active",
              "createdAt",
              "updatedAt",
            ],
          },
          401: {
            type: "object",
            properties: { message: { type: "string" } },
            required: ["message"],
          },
        },
      },
    },
    getCategoryById,
  );
}
