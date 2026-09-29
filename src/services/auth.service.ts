import { AuthRequest, RegisterRequest } from "../types";
import { prisma } from "../utils/prisma";
import bcrypt from "bcrypt";

export const registerUser = async (payLoad: RegisterRequest) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: payLoad.email },
  });

  if (existingUser) {
    throw new Error("E-mail já cadastrado.");
  }

  const hashedPassword = await bcrypt.hash(payLoad.password, 10);

  const newUser = await prisma.user.create({
    data: {
      firstName: payLoad.firstName,
      lastName: payLoad.lastName,
      email: payLoad.email,
      passwordHash: hashedPassword,
      cpf: payLoad.cpf,
      birthDate: payLoad.birthDate
        ? new Date(`${payLoad.birthDate}T00:00:00.000Z`)
        : undefined,
      phone: payLoad.phone,
      role: "USER",
    },
  });

  return newUser;
};

export const loginUser = async (data: AuthRequest) => {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) {
    throw new Error("Usuário não encontrado.");
  }

  const isValidPassword = await bcrypt.compare(
    data.password,
    user.passwordHash,
  );

  if (!isValidPassword) {
    throw new Error("Senha inválida.");
  }

  return user;
};
