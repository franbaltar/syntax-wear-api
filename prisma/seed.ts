import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

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
  },
];

async function main() {
  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product,
    });
  }

  console.log(`${products.length} produtos inseridos ou atualizados.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
