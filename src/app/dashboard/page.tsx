import type { TransactionType } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import {
  createCategoryAction,
  createTransactionAction,
  deleteCategoryAction,
  deleteTransactionAction,
} from "@/app/dashboard/actions";
import { CategoryManager } from "@/components/finance/category-manager";
import { PendingButton } from "@/components/finance/pending-button";
import { TransactionForm } from "@/components/finance/transaction-form";
import { redirect } from "next/navigation";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { getCurrentSession } from "@/lib/auth";
import {
  calculateSummary,
  formatCurrency,
  formatDate,
  transactionTypeLabels,
} from "@/lib/finance";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const session = await getCurrentSession();

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/dashboard");
  }

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [
    user,
    incomeAggregate,
    expenseAggregate,
    totalTransactions,
    monthlyTransactions,
    recentTransactions,
    categories,
  ] = await prisma.$transaction([
    prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        name: true,
        email: true,
      },
    }),
    prisma.transaction.aggregate({
      where: {
        userId: session.user.id,
        type: "INCOME",
      },
      _sum: {
        amount: true,
      },
    }),
    prisma.transaction.aggregate({
      where: {
        userId: session.user.id,
        type: "EXPENSE",
      },
      _sum: {
        amount: true,
      },
    }),
    prisma.transaction.count({
      where: {
        userId: session.user.id,
      },
    }),
    prisma.transaction.findMany({
      where: {
        userId: session.user.id,
        transactionDate: {
          gte: startOfMonth,
        },
      },
      select: {
        type: true,
        amount: true,
      },
    }),
    prisma.transaction.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: [
        {
          transactionDate: "desc",
        },
        {
          createdAt: "desc",
        },
      ],
      take: 12,
      select: {
        id: true,
        type: true,
        amount: true,
        note: true,
        transactionDate: true,
        category: {
          select: {
            name: true,
          },
        },
      },
    }),
    prisma.category.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: [
        {
          type: "asc",
        },
        {
          name: "asc",
        },
      ],
      select: {
        id: true,
        name: true,
        type: true,
        _count: {
          select: {
            transactions: true,
          },
        },
      },
    }),
  ]);

  if (!user?.email) {
    redirect("/login?callbackUrl=/dashboard");
  }

  const totalIncome = incomeAggregate._sum.amount ?? 0;
  const totalExpense = expenseAggregate._sum.amount ?? 0;
  const totalBalance = totalIncome - totalExpense;
  const monthlySummary = calculateSummary(monthlyTransactions);
  const summaryCards = [
    {
      label: "Saldo tersedia",
      value: formatCurrency(totalBalance),
      accent: "text-emerald-300",
      note: "Gambaran singkat dari posisi uang Anda saat ini.",
      glowClass: "from-emerald-400/18 via-emerald-400/5 to-transparent",
    },
    {
      label: "Pemasukan terkumpul",
      value: formatCurrency(totalIncome),
      accent: "text-cyan-300",
      note: "Total arus masuk yang sudah tersimpan di dashboard.",
      glowClass: "from-cyan-400/18 via-cyan-400/5 to-transparent",
    },
    {
      label: "Pengeluaran tercatat",
      value: formatCurrency(totalExpense),
      accent: "text-rose-300",
      note: "Belanja, tagihan, dan biaya lain yang sudah Anda rekam.",
      glowClass: "from-rose-400/18 via-rose-400/5 to-transparent",
    },
    {
      label: "Transaksi tersimpan",
      value: `${totalTransactions} transaksi`,
      accent: "text-amber-300",
      note: "Semakin rapi pencatatan, semakin mudah membaca polanya.",
      glowClass: "from-amber-400/18 via-amber-400/5 to-transparent",
    },
  ];

  const typeStyles: Record<TransactionType, string> = {
    INCOME: "border-cyan-400/20 bg-cyan-400/10 text-cyan-100",
    EXPENSE: "border-rose-400/20 bg-rose-400/10 text-rose-100",
  };

  const transactionCategories = categories.map((category) => ({
    id: category.id,
    name: category.name,
    type: category.type,
  }));

  const managedCategories = categories.map((category) => ({
    id: category.id,
    name: category.name,
    type: category.type,
    transactionCount: category._count.transactions,
  }));

  return (
    <main className="min-h-screen overflow-hidden">
      <section className="w-full px-6 py-12 lg:px-8 xl:px-10">
        <header className="glow-ring glass-panel animate-rise-in relative overflow-hidden rounded-[32px] border border-white/10 bg-slate-950/78 p-8 backdrop-blur">
          <div className="pointer-events-none absolute -left-10 top-10 h-36 w-36 rounded-full bg-emerald-400/12 blur-3xl animate-float-soft" />
          <div className="pointer-events-none absolute right-0 top-0 h-44 w-44 rounded-full bg-cyan-400/10 blur-3xl animate-float-delayed" />

          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-5">
              <div className="inline-flex items-center gap-4 rounded-full border border-white/10 bg-white/5 px-4 py-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950/80 shadow-lg shadow-emerald-500/10">
                  <Image
                    src="/vercel.svg"
                    alt="Logo Catatan Keuangan"
                    width={28}
                    height={28}
                    className="h-7 w-7"
                  />
                </span>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-200">
                    Ruang finansial pribadi
                  </p>
                  <p className="text-sm text-slate-300">
                    Dashboard rapi untuk uang yang terus bergerak.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h1 className="text-3xl font-semibold text-white sm:text-4xl">
                  Selamat datang kembali, {user.name ?? user.email}
                </h1>
                <p className="max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                  Semua arus uang Anda kini berkumpul di satu layar yang lebih
                  rapi. Catat transaksi, kelola kategori, dan lihat ringkasan
                  bulan ini tanpa pindah konteks.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 text-sm">
                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-slate-200">
                  {categories.length} kategori aktif
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-slate-200">
                  {monthlySummary.count} transaksi bulan ini
                </span>
              </div>
            </div>

            <div className="relative flex flex-wrap gap-3 lg:justify-end">
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/10"
              >
                Kembali ke beranda
              </Link>
              <SignOutButton />
            </div>
          </div>
        </header>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => (
            <article
              key={card.label}
              className="glass-panel hover-lift relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur"
            >
              <div
                className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${card.glowClass} opacity-80`}
              />

              <div className="relative">
                <p className="text-sm text-slate-400">{card.label}</p>
                <p className={`mt-3 text-2xl font-semibold ${card.accent}`}>
                  {card.value}
                </p>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  {card.note}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            <TransactionForm
              action={createTransactionAction}
              categories={transactionCategories}
            />

            <CategoryManager
              categories={managedCategories}
              createAction={createCategoryAction}
              deleteAction={deleteCategoryAction}
            />
          </div>

          <aside className="glass-panel hover-lift rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur">
            <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-100">
              Momentum bulan ini
            </span>

            <h2 className="mt-5 text-2xl font-semibold text-white">
              Ringkasan bulan berjalan yang mudah dibaca.
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-300">
              Blok ini merangkum aktivitas dari awal bulan sampai hari ini agar
              Anda cepat tahu kondisi keuangan terbaru.
            </p>

            <dl className="mt-8 space-y-5 text-sm text-slate-300">
              <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-5">
                <dt className="text-slate-400">Saldo bulan ini</dt>
                <dd className="mt-2 text-xl font-semibold text-emerald-300">
                  {formatCurrency(monthlySummary.balance)}
                </dd>
              </div>

              <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-5">
                <dt className="text-slate-400">Pemasukan bulan ini</dt>
                <dd className="mt-2 font-medium text-cyan-300">
                  {formatCurrency(monthlySummary.income)}
                </dd>
              </div>

              <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-5">
                <dt className="text-slate-400">Pengeluaran bulan ini</dt>
                <dd className="mt-2 font-medium text-rose-300">
                  {formatCurrency(monthlySummary.expense)}
                </dd>
              </div>

              <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-5">
                <dt className="text-slate-400">Aktivitas bulan ini</dt>
                <dd className="mt-2 font-medium text-white">
                  {monthlySummary.count} transaksi tercatat
                </dd>
              </div>
            </dl>

            <div className="mt-8 rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.16),rgba(15,23,42,0.92))] p-5">
              <p className="text-sm font-medium text-white">Insight cepat</p>
              <p className="mt-2 text-sm leading-7 text-slate-300">
                Kategori yang rapi akan membuat filter bulan dan laporan grafik
                nanti lebih mudah dipakai. Fondasinya sudah siap dari sini.
              </p>
            </div>
          </aside>
        </div>

        <section className="glass-panel mt-8 rounded-[32px] border border-white/10 bg-slate-950/78 p-8 backdrop-blur">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-white">
                Transaksi terbaru
              </h2>
              <p className="mt-2 text-sm leading-7 text-slate-300">
                Dua belas transaksi terakhir yang baru Anda catat, disusun agar
                cepat dipindai dan mudah ditinjau ulang.
              </p>
            </div>

            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
              {recentTransactions.length} transaksi ditampilkan
            </span>
          </div>

          {recentTransactions.length === 0 ? (
            <div className="mt-6 rounded-3xl border border-dashed border-white/15 bg-white/5 px-6 py-10 text-center text-sm leading-7 text-slate-300">
              Belum ada transaksi yang tercatat. Begitu transaksi pertama masuk,
              riwayat akan tampil di sini dengan tampilan yang lebih hidup dan
              mudah diikuti.
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {recentTransactions.map((transaction) => (
                <article
                  key={transaction.id}
                  className="glass-panel hover-lift group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.045] p-5 md:flex md:items-center md:justify-between"
                >
                  <div className="pointer-events-none absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-emerald-300/0 via-emerald-300/60 to-cyan-300/0 opacity-70" />

                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${typeStyles[transaction.type]}`}
                      >
                        {transactionTypeLabels[transaction.type]}
                      </span>
                      <span className="text-sm text-slate-400">
                        {formatDate(transaction.transactionDate)}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {transaction.category.name}
                      </h3>
                      <p className="mt-1 text-sm text-slate-300">
                        {transaction.note ||
                          "Belum ada catatan tambahan."}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col items-start gap-3 md:mt-0 md:items-end">
                    <p
                      className={`text-lg font-semibold ${
                        transaction.type === "INCOME"
                          ? "text-cyan-300"
                          : "text-rose-300"
                      }`}
                    >
                      {transaction.type === "INCOME" ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </p>

                    <form action={deleteTransactionAction}>
                      <input
                        type="hidden"
                        name="transactionId"
                        value={transaction.id}
                      />
                      <PendingButton
                        idleLabel="Hapus"
                        pendingLabel="Menghapus..."
                        className="inline-flex items-center justify-center rounded-full border border-rose-400/20 bg-rose-400/10 px-4 py-2 text-sm font-semibold text-rose-100 transition hover:bg-rose-400/20 disabled:cursor-not-allowed disabled:opacity-70"
                      />
                    </form>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
