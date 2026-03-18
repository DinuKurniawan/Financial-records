"use client";

import type { TransactionType } from "@prisma/client";
import { useActionState, useEffect, useRef } from "react";
import type { CategoryFormState } from "@/app/dashboard/actions";
import { CategoryDeleteForm } from "@/components/finance/category-delete-form";
import { PendingButton } from "@/components/finance/pending-button";
import { transactionTypeLabels } from "@/lib/finance";

type CategoryManagerCreateAction = (
  state: CategoryFormState,
  formData: FormData,
) => Promise<CategoryFormState>;

type CategoryManagerDeleteAction = (
  state: CategoryFormState,
  formData: FormData,
) => Promise<CategoryFormState>;

type ManagedCategory = {
  id: string;
  name: string;
  type: TransactionType;
  transactionCount: number;
};

type CategoryManagerProps = {
  categories: ManagedCategory[];
  createAction: CategoryManagerCreateAction;
  deleteAction: CategoryManagerDeleteAction;
};

const initialState: CategoryFormState = {
  status: "idle",
};

const categoryTypeOrder: TransactionType[] = ["EXPENSE", "INCOME"];

export function CategoryManager({
  categories,
  createAction,
  deleteAction,
}: CategoryManagerProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useActionState(createAction, initialState);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state.status]);

  return (
    <section className="glass-panel hover-lift relative overflow-hidden rounded-[32px] border border-white/10 bg-slate-950/72 p-8 backdrop-blur">
      <div className="pointer-events-none absolute -left-10 bottom-0 h-32 w-32 rounded-full bg-cyan-400/10 blur-3xl animate-float-delayed" />
      <div className="pointer-events-none absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-cyan-300/0 via-cyan-300/70 to-violet-300/0" />

      <div className="relative space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200">
          Ruang kategori
        </p>
        <h2 className="text-2xl font-semibold text-white">
          Kelola kategori transaksi
        </h2>
        <p className="text-sm leading-7 text-slate-300">
          Simpan kategori pemasukan dan pengeluaran yang benar-benar Anda pakai
          agar pencatatan terasa lebih konsisten dan laporan berikutnya lebih
          mudah dibaca.
        </p>
      </div>

      <form
        ref={formRef}
        action={formAction}
        className="relative mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-[0.8fr_1.2fr_auto] lg:items-end"
      >
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-200" htmlFor="category-type">
            Tipe kategori
          </label>
          <select
            id="category-type"
            name="type"
            defaultValue="EXPENSE"
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
          <label className="text-sm font-medium text-slate-200" htmlFor="category-name">
            Nama kategori
          </label>
          <input
            id="category-name"
            name="name"
            type="text"
            placeholder="Contoh: Kesehatan, Sewa, Komisi"
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-400 focus:border-emerald-300/70"
            required
          />
        </div>

        <PendingButton
          idleLabel="Tambah kategori"
          pendingLabel="Menyimpan..."
          className="inline-flex h-[50px] items-center justify-center rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-70"
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

      <div className="mt-8 grid gap-4 xl:grid-cols-2">
        {categoryTypeOrder.map((type) => {
          const items = categories.filter((category) => category.type === type);

          return (
            <div
              key={type}
              className="glass-panel rounded-3xl border border-white/10 bg-white/5 p-5"
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-semibold text-white">
                  {transactionTypeLabels[type]}
                </h3>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300">
                  {items.length} kategori
                </span>
              </div>

              {items.length === 0 ? (
                <div className="mt-4 rounded-2xl border border-dashed border-white/10 bg-slate-950/50 px-4 py-5 text-sm leading-7 text-slate-400">
                  Belum ada kategori untuk tipe ini. Tambahkan satu dan biarkan
                  dashboard langsung menyesuaikan.
                </div>
              ) : (
                <div className="mt-4 space-y-3">
                  {items.map((category) => (
                    <article
                      key={category.id}
                      className="hover-lift flex flex-col gap-4 rounded-2xl border border-white/10 bg-slate-950/60 p-4 md:flex-row md:items-center md:justify-between"
                    >
                      <div>
                        <p className="font-medium text-white">{category.name}</p>
                        <p className="mt-1 text-sm text-slate-400">
                          {category.transactionCount === 0
                            ? "Belum dipakai transaksi."
                            : `Sudah dipakai di ${category.transactionCount} transaksi.`}
                        </p>
                      </div>

                      {category.transactionCount === 0 ? (
                        <CategoryDeleteForm
                          action={deleteAction}
                          categoryId={category.id}
                        />
                      ) : (
                        <span className="inline-flex rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-xs font-medium text-amber-100">
                          Tidak bisa dihapus
                        </span>
                      )}
                    </article>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
