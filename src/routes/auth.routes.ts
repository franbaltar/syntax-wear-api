import { FastifyInstance } from "fastify";
import { login, register } from "../controllers/auth.controller";

export default async function authRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/register",
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

              description: "Email do usuário",
            },
            password: {
              type: "string",

              description: "Senha do usuário",
            },
            cpf: {
              type: "string",
              description: "CPF do usuário",
            },
            birthDate: {
              type: "string",

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

  fastify.post(
    "/login",
    {
      schema: {
        tags: ["Auth"],
        description: "Autentica um usuário e retorna um token JWT",
        body: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              description: "Email do usuário",
            },
            password: {
              type: "string",
              format: "password",
              description: "Senha do usuário",
            },
          },
        },
      },
    },
    login,
  );
}
