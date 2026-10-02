import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

const categories = [
  {
    name: "Camisetas",
    slug: "camisetas",
    description: "Camisetas casuais para o dia a dia.",
    active: true,
  },
  {
    name: "Moletons",
    slug: "moletons",
    description: "Moletons para diferentes estilos e ocasioes.",
    active: true,
  },
  {
    name: "Calcas",
    slug: "calcas",
    description: "Calcas casuais e funcionais.",
    active: true,
  },
  {
    name: "Jaquetas",
    slug: "jaquetas",
    description: "Jaquetas leves para diferentes ocasioes.",
    active: true,
  },
  {
    name: "Shorts",
    slug: "shorts",
    description: "Shorts casuais e esportivos.",
    active: true,
  },
  {
    name: "Acessorios",
    slug: "acessorios",
    description: "Acessorios para complementar o visual.",
    active: true,
  },
  {
    name: "Meias",
    slug: "meias",
    description: "Meias confortaveis para diferentes estilos.",
    active: true,
  },
];

const products = [
  {
    name: "Camiseta Oversized Syntax",
    slug: "camiseta-oversized-syntax",
    description:
      "Camiseta oversized com algodao premium e estampa minimalista.",
    price: "129.90",
    sku: "SY-CAM-001",
    images: ["/uploads/camiseta-oversized-syntax.jpg"],
    colors: ["preto", "branco"],
    sizes: ["P", "M", "G", "GG"],
    stock: 35,
    categorySlug: "camisetas",
  },
  {
    name: "Moletom Code Mode",
    slug: "moletom-code-mode",
    description: "Moletom encorpado com capuz e acabamento macio.",
    price: "249.90",
    sku: "SY-MOL-002",
    images: ["/uploads/moletom-code-mode.jpg"],
    colors: ["preto", "cinza"],
    sizes: ["M", "G", "GG"],
    stock: 20,
    categorySlug: "moletons",
  },
  {
    name: "Calca Cargo Dev",
    slug: "calca-cargo-dev",
    description: "Calca cargo de sarja com bolsos funcionais.",
    price: "219.90",
    sku: "SY-CAR-003",
    images: ["/uploads/calca-cargo-dev.jpg"],
    colors: ["preto", "verde militar"],
    sizes: ["38", "40", "42", "44"],
    stock: 18,
    categorySlug: "calcas",
  },
  {
    name: "Jaqueta Windbreaker",
    slug: "jaqueta-windbreaker",
    description: "Jaqueta leve e resistente para dias de vento.",
    price: "299.90",
    sku: "SY-JAQ-004",
    images: ["/uploads/jaqueta-windbreaker.jpg"],
    colors: ["azul marinho", "preto"],
    sizes: ["P", "M", "G", "GG"],
    stock: 12,
    categorySlug: "jaquetas",
  },
  {
    name: "Bone Syntax Logo",
    slug: "bone-syntax-logo",
    description: "Bone de aba curva com logo bordado.",
    price: "89.90",
    sku: "SY-BON-005",
    images: ["/uploads/bone-syntax-logo.jpg"],
    colors: ["preto", "bege"],
    sizes: ["unico"],
    stock: 40,
    categorySlug: "acessorios",
  },
  {
    name: "Regata Terminal",
    slug: "regata-terminal",
    description: "Regata leve para treinos e producoes casuais.",
    price: "99.90",
    sku: "SY-REG-006",
    images: ["/uploads/regata-terminal.jpg"],
    colors: ["branco", "cinza mescla"],
    sizes: ["P", "M", "G"],
    stock: 25,
    categorySlug: "camisetas",
  },
  {
    name: "Shorts Utility",
    slug: "shorts-utility",
    description: "Shorts casual com tecido resistente e bolsos amplos.",
    price: "139.90",
    sku: "SY-SHO-007",
    images: ["/uploads/shorts-utility.jpg"],
    colors: ["preto", "caqui"],
    sizes: ["38", "40", "42", "44"],
    stock: 22,
    categorySlug: "shorts",
  },
  {
    name: "Cropped Commit",
    slug: "cropped-commit",
    description: "Cropped confortavel com modelagem moderna.",
    price: "109.90",
    sku: "SY-CRO-008",
    images: ["/uploads/cropped-commit.jpg"],
    colors: ["branco", "rosa"],
    sizes: ["P", "M", "G"],
    stock: 16,
    categorySlug: "camisetas",
  },
  {
    name: "Meias Stack",
    slug: "meias-stack",
    description: "Kit com duas meias de algodao com logo Syntax.",
    price: "49.90",
    sku: "SY-MEI-009",
    images: ["/uploads/meias-stack.jpg"],
    colors: ["preto", "branco"],
    sizes: ["unico"],
    stock: 60,
    categorySlug: "meias",
  },
  {
    name: "Bolsa Crossbody Deploy",
    slug: "bolsa-crossbody-deploy",
    description: "Bolsa compacta para levar o essencial com praticidade.",
    price: "159.90",
    sku: "SY-BOL-010",
    images: ["/uploads/bolsa-crossbody-deploy.jpg"],
    colors: ["preto", "cinza"],
    sizes: ["unico"],
    stock: 14,
    categorySlug: "acessorios",
  },
];

async function main() {
  const categoryIds = new Map<string, number>();

  for (const category of categories) {
    const savedCategory = await prisma.category.upsert({
      where: { slug: category.slug },
      update: category,
      create: category,
    });
    categoryIds.set(category.slug, savedCategory.id);
  }

  for (const product of products) {
    const { categorySlug, ...productData } = product;
    const categoryId = categoryIds.get(categorySlug);

    if (categoryId === undefined) {
      throw new Error(
        `Categoria nao encontrada para o produto ${product.slug}`,
      );
    }

    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        ...productData,
        category: { connect: { id: categoryId } },
      },
      create: {
        ...productData,
        category: { connect: { id: categoryId } },
      },
    });
  }

  console.log(
    `${categories.length} categorias e ${products.length} produtos inseridos ou atualizados.`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
