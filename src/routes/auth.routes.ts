import { FastifyInstance } from "fastify";
import { register } from "../controllers/auth.controller";

export default async function authRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/",
    {
      schema: {
        tags: ["Auth"],
        description: "Registra um novo usuário e retorna um token JWT",
        body: {
          type: "object",
          required: ["firstName", "lastName", "email", "password"],
          properties: {
            firstName: {
              type: "string",
              description: "Primeiro nome do usuário",
            },
            lastName: {
              type: "string",
              description: "Sobrenome do usuário",
            },
            email: {
              type: "string",
              format: "email",
              description: "Email do usuário",
            },
            password: {
              type: "string",
              format: "password",
              description: "Senha do usuário",
              minLength: 8,
            },
            cpf: {
              type: "string",
              description: "CPF do usuário",
            },
            birthDate: {
              type: "string",
              format: "date",
              description: "Data de nascimento no formato YYYY-MM-DD",
            },
            phone: {
              type: "string",
              description: "Telefone do usuário",
            },
          },
        },
      },
    },
    register,
  );
}
