import { FastifyRequest, FastifyReply } from "fastify";
import { getUserRole } from "../services/auth.service";

export const authenticate = async (
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> => {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.status(401).send({ message: "Token inválido ou expirado." });
  }
};

export const authorizeAdmin = async (
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> => {
  let payload: { userId: number };

  try {
    payload = await request.jwtVerify<{ userId: number }>();
  } catch {
    reply.status(401).send({ message: "Token inválido ou expirado." });
    return;
  }

  const role = await getUserRole(payload.userId);

  if (!role) {
    reply.status(401).send({ message: "Usuário não encontrado." });
    return;
  }

  if (role !== "ADMIN") {
    reply.status(403).send({ message: "Acesso não autorizado." });
  }
};
