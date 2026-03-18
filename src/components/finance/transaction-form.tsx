"use client";

import type { TransactionType } from "@prisma/client";
import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import type { TransactionFormState } from "@/app/dashboard/actions";
import { PendingButton } from "@/components/finance/pending-button";
import { getTodayDateValue, transactionTypeLabels } from "@/lib/finance";

type TransactionFormAction = (
  state: TransactionFormState,
  formData: FormData,
) => Promise<TransactionFormState>;

type TransactionCategoryOption = {
  id: string;
  name: string;
  type: TransactionType;
};

type TransactionFormProps = {
  action: TransactionFormAction;
  categories: TransactionCategoryOption[];
};

const initialState: TransactionFormState = {
  status: "idle",
};

const defaultTransactionType: TransactionType = "EXPENSE";

export function TransactionForm({
  action,
  categories,
}: TransactionFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useActionState(action, initialState);
  const [selectedType, setSelectedType] =
    useState<TransactionType>(defaultTransactionType);
  const filteredCategories = useMemo(
    () => categories.filter((category) => category.type === selectedType),
    [categories, selectedType],
  );
  const categorySelectKey = `${selectedType}:${filteredCategories
    .map((category) => category.id)
    .join(",")}`;

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state.status]);

  const hasAvailableCategories = filteredCategories.length > 0;

  return (
    <div className="glass-panel hover-lift relative overflow-hidden rounded-[32px] border border-white/10 bg-slate-950/72 p-8 backdrop-blur">
      <div className="pointer-events-none absolute -right-12 top-10 h-28 w-28 rounded-full bg-emerald-400/10 blur-3xl animate-float-soft" />
      <div className="pointer-events-none absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-emerald-300/0 via-emerald-300/70 to-cyan-300/0" />

      <div className="relative space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-200">
          Catatan cepat
        </p>
        <h2 className="text-2xl font-semibold text-white">
          Tambah transaksi baru
        </h2>
        <p className="text-sm leading-7 text-slate-300">
          Isi transaksi harian Anda dengan cepat. Pilih tipenya, tentukan
          kategori yang sesuai, lalu simpan tanpa langkah yang berlebihan.
        </p>
      </div>

      <form ref={formRef} action={formAction} className="relative mt-6 space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-200" htmlFor="type">
              Tipe transaksi
            </label>
            <select
              id="type"
              name="type"
              value={selectedType}
              onChange={(event) => {
                const nextType = event.target.value as TransactionType;
                setSelectedType(nextType);
              }}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-300/70"
            >
              {Object.entries(transactionTypeLabels).map(([value, label]) => (
                <option key={value} value={value} className="bg-slate-900">
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-200" htmlFor="date">
              Tanggal
            </label>
            <input
              id="date"
              name="transactionDate"
              type="date"
              defaultValue={getTodayDateValue()}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-300/70"
              required
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label
              className="text-sm font-medium text-slate-200"
              htmlFor="amount"
            >
              Nominal (Rupiah)
            </label>
            <input
              id="amount"
              name="amount"
              type="text"
              inputMode="numeric"
              placeholder="250000"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-400 focus:border-emerald-300/70"
              required
            />
          </div>

          <div className="space-y-2">
            <label
              className="text-sm font-medium text-slate-200"
              htmlFor="categoryId"
            >
              Kategori
            </label>
            <select
              id="categoryId"
              key={categorySelectKey}
              name="categoryId"
              defaultValue={filteredCategories[0]?.id ?? ""}
              disabled={!hasAvailableCategories}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition disabled:cursor-not-allowed disabled:opacity-70 focus:border-emerald-300/70"
              required
            >
              {hasAvailableCategories ? (
                filteredCategories.map((category) => (
                  <option
                    key={category.id}
                    value={category.id}
                    className="bg-slate-900"
                  >
                    {category.name}
                  </option>
                ))
              ) : (
                <option value="" className="bg-slate-900">
                  Belum ada kategori untuk tipe ini
                </option>
              )}
            </select>
            <p className="text-xs leading-5 text-slate-400">
              {hasAvailableCategories
                ? "Kategori otomatis disesuaikan dengan tipe transaksi yang Anda pilih."
                : "Belum ada kategori yang cocok. Tambahkan dulu lewat panel kategori di bawah."}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-200" htmlFor="note">
            Catatan
          </label>
          <textarea
            id="note"
            name="note"
            rows={3}
            placeholder="Opsional, misalnya: meeting klien, makan siang kantor, atau bonus proyek"
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-400 focus:border-emerald-300/70"
          />
        </div>

        <PendingButton
          idleLabel="Simpan transaksi"
          pendingLabel="Menyimpan..."
          disabled={!hasAvailableCategories}
        />
      </form>

      {state.message ? (
        <p
          className={`mt-4 rounded-2xl px-4 py-3 text-sm ${
            state.status === "success"
              ? "border border-emerald-400/20 bg-emerald-400/10 text-emerald-100"
              : "border border-rose-400/20 bg-rose-400/10 text-rose-100"
          }`}
        >
          {state.message}
        </p>
      ) : null}
    </div>
  );
}
