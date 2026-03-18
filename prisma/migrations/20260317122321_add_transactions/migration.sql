-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "normalizedName" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Category_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "categoryId" TEXT NOT NULL,
    "note" TEXT,
    "transactionDate" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Transaction_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Seed default categories for users that already exist before this migration runs
WITH "default_categories"("type", "name", "normalizedName") AS (
    VALUES
        ('INCOME', 'Gaji', 'gaji'),
        ('INCOME', 'Freelance', 'freelance'),
        ('INCOME', 'Bonus', 'bonus'),
        ('INCOME', 'Investasi', 'investasi'),
        ('INCOME', 'Hadiah', 'hadiah'),
        ('INCOME', 'Lainnya', 'lainnya'),
        ('EXPENSE', 'Makan', 'makan'),
        ('EXPENSE', 'Transportasi', 'transportasi'),
        ('EXPENSE', 'Belanja', 'belanja'),
        ('EXPENSE', 'Tagihan', 'tagihan'),
        ('EXPENSE', 'Hiburan', 'hiburan'),
        ('EXPENSE', 'Kesehatan', 'kesehatan'),
        ('EXPENSE', 'Pendidikan', 'pendidikan'),
        ('EXPENSE', 'Lainnya', 'lainnya')
)
INSERT INTO "Category" (
    "id",
    "userId",
    "type",
    "name",
    "normalizedName",
    "createdAt",
    "updatedAt"
)
SELECT
    lower(hex(randomblob(16))),
    "User"."id",
    "default_categories"."type",
    "default_categories"."name",
    "default_categories"."normalizedName",
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM "User"
CROSS JOIN "default_categories";

-- CreateIndex
CREATE UNIQUE INDEX "Category_userId_type_normalizedName_key" ON "Category"("userId", "type", "normalizedName");
CREATE INDEX "Category_userId_type_name_idx" ON "Category"("userId", "type", "name");

-- CreateIndex
CREATE INDEX "Transaction_userId_transactionDate_idx" ON "Transaction"("userId", "transactionDate");
CREATE INDEX "Transaction_categoryId_idx" ON "Transaction"("categoryId");
