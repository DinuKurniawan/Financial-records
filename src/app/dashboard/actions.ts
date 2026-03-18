"use server";

import { revalidatePath } from "next/cache";
import {
  categoryFormSchema,
  normalizeCategoryName,
} from "@/lib/categories";
import { getCurrentSession } from "@/lib/auth";
import {
  parseAmountToRupiah,
  parseTransactionDate,
  transactionFormSchema,
} from "@/lib/finance";
import { prisma } from "@/lib/prisma";
import { getFirstErrorMessage } from "@/lib/validation";

type FormActionState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export type TransactionFormState = FormActionState;
export type CategoryFormState = FormActionState;

export async function createTransactionAction(
  _prevState: TransactionFormState,
  formData: FormData,
): Promise<TransactionFormState> {
  const session = await getCurrentSession();

  if (!session?.user?.id) {
    return {
      status: "error",
      message: "Sesi login Anda sudah berakhir. Silakan login kembali.",
    };
  }

  const parsedData = transactionFormSchema.safeParse({
    type: formData.get("type"),
    amount: formData.get("amount"),
    categoryId: formData.get("categoryId"),
    transactionDate: formData.get("transactionDate"),
    note: formData.get("note"),
  });

  if (!parsedData.success) {
    return {
      status: "error",
      message: getFirstErrorMessage(parsedData.error),
    };
  }

  const amount = parseAmountToRupiah(parsedData.data.amount);

  if (!amount) {
    return {
      status: "error",
      message: "Nominal harus berupa angka Rupiah yang valid.",
    };
  }

  const transactionDate = parseTransactionDate(parsedData.data.transactionDate);

  if (!transactionDate) {
    return {
      status: "error",
      message: "Tanggal transaksi tidak valid.",
    };
  }

  const category = await prisma.category.findFirst({
    where: {
      id: parsedData.data.categoryId,
      userId: session.user.id,
    },
    select: {
      id: true,
      type: true,
    },
  });

  if (!category) {
    return {
      status: "error",
      message: "Kategori yang dipilih tidak ditemukan.",
    };
  }

  if (category.type !== parsedData.data.type) {
    return {
      status: "error",
      message: "Kategori tidak cocok dengan tipe transaksi yang dipilih.",
    };
  }

  await prisma.transaction.create({
    data: {
      userId: session.user.id,
      type: parsedData.data.type,
      amount,
      categoryId: category.id,
      note: parsedData.data.note || null,
      transactionDate,
    },
  });

  revalidatePath("/dashboard");

  return {
    status: "success",
    message: "Transaksi berhasil ditambahkan.",
  };
}

export async function createCategoryAction(
  _prevState: CategoryFormState,
  formData: FormData,
): Promise<CategoryFormState> {
  const session = await getCurrentSession();

  if (!session?.user?.id) {
    return {
      status: "error",
      message: "Sesi login Anda sudah berakhir. Silakan login kembali.",
    };
  }

  const parsedData = categoryFormSchema.safeParse({
    type: formData.get("type"),
    name: formData.get("name"),
  });

  if (!parsedData.success) {
    return {
      status: "error",
      message: getFirstErrorMessage(parsedData.error),
    };
  }

  const normalizedName = normalizeCategoryName(parsedData.data.name);
  const existingCategory = await prisma.category.findFirst({
    where: {
      userId: session.user.id,
      type: parsedData.data.type,
      normalizedName,
    },
    select: {
      id: true,
    },
  });

  if (existingCategory) {
    return {
      status: "error",
      message: "Kategori dengan nama tersebut sudah ada untuk tipe ini.",
    };
  }

  await prisma.category.create({
    data: {
      userId: session.user.id,
      type: parsedData.data.type,
      name: parsedData.data.name,
      normalizedName,
    },
  });

  revalidatePath("/dashboard");

  return {
    status: "success",
    message: "Kategori berhasil ditambahkan.",
  };
}

export async function deleteCategoryAction(
  _prevState: CategoryFormState,
  formData: FormData,
): Promise<CategoryFormState> {
  const session = await getCurrentSession();

  if (!session?.user?.id) {
    return {
      status: "error",
      message: "Sesi login Anda sudah berakhir. Silakan login kembali.",
    };
  }

  const categoryId = formData.get("categoryId");

  if (typeof categoryId !== "string" || categoryId.length === 0) {
    return {
      status: "error",
      message: "Kategori yang akan dihapus tidak valid.",
    };
  }

  const category = await prisma.category.findFirst({
    where: {
      id: categoryId,
      userId: session.user.id,
    },
    select: {
      id: true,
      _count: {
        select: {
          transactions: true,
        },
      },
    },
  });

  if (!category) {
    return {
      status: "error",
      message: "Kategori tidak ditemukan.",
    };
  }

  if (category._count.transactions > 0) {
    return {
      status: "error",
      message: "Kategori yang sudah dipakai transaksi tidak bisa dihapus.",
    };
  }

  await prisma.category.delete({
    where: {
      id: category.id,
    },
  });

  revalidatePath("/dashboard");

  return {
    status: "success",
    message: "Kategori berhasil dihapus.",
  };
}

export async function deleteTransactionAction(formData: FormData) {
  const session = await getCurrentSession();

  if (!session?.user?.id) {
    return;
  }

  const transactionId = formData.get("transactionId");

  if (typeof transactionId !== "string" || transactionId.length === 0) {
    return;
  }

  await prisma.transaction.deleteMany({
    where: {
      id: transactionId,
      userId: session.user.id,
    },
  });

  revalidatePath("/dashboard");
}
