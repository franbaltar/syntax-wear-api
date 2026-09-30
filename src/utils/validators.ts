import z from "zod";

export const loginSchema = z.object({
  email: z.email("Email inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

export const registerSchema = z.object({
  firstName: z.string().min(1, "Nome é obrigatório"),
  lastName: z.string().min(1, "Sobrenome é obrigatório"),
  email: z.email("Email inválido"),
  password: z.string().min(8, "Senha deve ter no mínimo 8 caracteres"),
  cpf: z.string().optional(),
  birthDate: z.iso.date("Data de nascimento inválida").optional(),
  phone: z.string().optional(),
});

export const productFilterSchema = z.object({
  page: z.number().int().min(1, "Página deve ser no mínimo 1").optional(),
  limit: z.number().int().min(1, "Limite deve ser no mínimo 1").optional(),
  minPrice: z.number().min(0, "Preço mínimo deve ser positivo").optional(),
  maxPrice: z.number().min(0, "Preço máximo deve ser positivo").optional(),
  search: z.string().optional(),
  sortBy: z.enum(["name", "price", "createdAt"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

export const createProductSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  price: z.number().nonnegative("Preço deve ser positivo"),
  colors: z.array(z.string()).optional(),
  sizes: z.array(z.string()).optional(),
  stock: z.number().int().nonnegative("Estoque deve ser positivo"),
  slug: z.string().min(1, "Slug é obrigatório"),
  active: z.boolean(),
  images: z.array(z.string()).optional(),
});
