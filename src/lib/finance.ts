import { TransactionType } from "@prisma/client";
import { z } from "zod";

export const transactionTypeLabels: Record<TransactionType, string> = {
  INCOME: "Pemasukan",
  EXPENSE: "Pengeluaran",
};

export const transactionFormSchema = z.object({
  type: z.enum(["INCOME", "EXPENSE"]),
  amount: z.string().trim().min(1, "Nominal wajib diisi."),
  categoryId: z.string().trim().min(1, "Kategori wajib dipilih."),
  transactionDate: z
    .string()
    .trim()
    .min(1, "Tanggal transaksi wajib diisi."),
  note: z.string().trim().max(160, "Catatan maksimal 160 karakter."),
});

export function parseAmountToRupiah(value: string) {
  const digits = value.replace(/[^\d]/g, "");

  if (!digits) {
    return null;
  }

  const amount = Number.parseInt(digits, 10);

  if (!Number.isSafeInteger(amount) || amount <= 0) {
    return null;
  }

  return amount;
}

export function parseTransactionDate(value: string) {
  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function getTodayDateValue() {
  const now = new Date();
  const year = now.getFullYear();
  const month = `${now.getMonth() + 1}`.padStart(2, "0");
  const day = `${now.getDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function calculateSummary(
  transactions: Array<{
    type: TransactionType;
    amount: number;
  }>,
) {
  return transactions.reduce(
    (summary, transaction) => {
      if (transaction.type === TransactionType.INCOME) {
        summary.income += transaction.amount;
      } else {
        summary.expense += transaction.amount;
      }

      summary.count += 1;
      summary.balance = summary.income - summary.expense;

      return summary;
    },
    {
      income: 0,
      expense: 0,
      balance: 0,
      count: 0,
    },
  );
}
