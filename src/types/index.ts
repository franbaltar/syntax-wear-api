export interface ProductFilters {
  page?: number;
  limit?: number;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sortBy?: "price" | "name";
  sortOrder?: "asc" | "desc";
}

export interface AuthRequest {
  email: string;
  password: string;
}

export interface RegisterRequest extends AuthRequest {
  firstName: string;
  lastName: string;
  cpf?: string;
  birthDate?: string;
  phone?: string;
  role?: "USER" | "ADMIN";
}

export interface CreateProduct {
  name: string;
  description: string;
  price: number;
  colors?: string[];
  sizes?: string[];
  stock: number;
  slug: string;
  active: boolean;
  images?: string[];
}
