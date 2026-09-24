import { RegisterRequest } from "../types";
import { prisma } from "../utils/prisma";

export const registerUser = async (payLoad: RegisterRequest) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: payLoad.email },
  });

  if (existingUser) {
    throw new Error("E-mail já cadastrado.");
  }

  const newUser = await prisma.user.create({
    data: {
      firstName: payLoad.firstName,
      lastName: payLoad.lastName,
      email: payLoad.email,
      passwordHash: payLoad.password,
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
