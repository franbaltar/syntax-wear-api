BEGIN;

CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

INSERT INTO "Category" ("name", "slug")
VALUES ('Sem categoria', 'sem-categoria');

ALTER TABLE "Product" ADD COLUMN "categoryId" INTEGER;

UPDATE "Product"
SET "categoryId" = (
    SELECT "id"
    FROM "Category"
    WHERE "slug" = 'sem-categoria'
)
WHERE "categoryId" IS NULL;

ALTER TABLE "Product" ALTER COLUMN "categoryId" SET NOT NULL;

ALTER TABLE "Product"
ADD CONSTRAINT "Product_categoryId_fkey"
FOREIGN KEY ("categoryId") REFERENCES "Category"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

COMMIT;