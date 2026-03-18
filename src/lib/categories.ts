import { TransactionType } from "@prisma/client";
import { z } from "zod";

export const defaultCategoryMap: Record<TransactionType, readonly string[]> = {
  INCOME: ["Gaji", "Freelance", "Bonus", "Investasi", "Hadiah", "Lainnya"],
  EXPENSE: [
    "Makan",
    "Transportasi",
    "Belanja",
    "Tagihan",
    "Hiburan",
    "Kesehatan",
    "Pendidikan",
    "Lainnya",
  ],
};

export function cleanCategoryName(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

export function normalizeCategoryName(value: string) {
  return cleanCategoryName(value).toLowerCase();
}

export const categoryFormSchema = z.object({
  type: z.enum(["INCOME", "EXPENSE"]),
  name: z
    .string()
    .transform(cleanCategoryName)
    .pipe(
      z
        .string()
        .min(2, "Nama kategori minimal 2 karakter.")
        .max(50, "Nama kategori maksimal 50 karakter."),
    ),
});

export function buildDefaultCategoriesForUser(userId: string) {
  return Object.entries(defaultCategoryMap).flatMap(([type, names]) =>
    names.map((name) => ({
      userId,
      type: type as TransactionType,
      name,
      normalizedName: normalizeCategoryName(name),
    })),
  );
}
