import Image from "next/image";
import Link from "next/link";
import { getCurrentSession } from "@/lib/auth";

const heroSignals = [
  {
    label: "Saldo langsung ikut berubah",
  },
  {
    label: "Kategori terasa lebih rapi",
  },
  {
    label: "Fokus ke arus kas harian",
  },
];

const heroFeatures = [
  {
    title: "Masuk dengan mulus",
    description:
      "Email/password dan Google sudah siap, jadi onboarding terasa cepat sejak layar pertama.",
  },
  {
    title: "Dashboard yang lebih bersih",
    description:
      "Transaksi, kategori, dan ringkasan bulan ini disusun lebih jelas supaya cepat dibaca.",
    },
  {
    title: "Siap tumbuh ke fitur berikutnya",
    description:
      "Fondasi data dan UI-nya sudah pas untuk lanjut ke filter bulan, edit transaksi, sampai grafik laporan.",
  },
];

const previewTransactions = [
  {
    title: "Proyek landing page",
    meta: "Pemasukan • Hari ini",
    amount: "+Rp2.500.000",
    tone: "text-cyan-300",
  },
  {
    title: "Makan malam tim",
    meta: "Pengeluaran • 18 Mar",
    amount: "-Rp185.000",
    tone: "text-rose-300",
  },
  {
    title: "Top up investasi",
    meta: "Pemasukan • 17 Mar",
    amount: "+Rp500.000",
    tone: "text-emerald-300",
  },
];

export default async function Home() {
  const session = await getCurrentSession();

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="animate-float-soft absolute left-[-4rem] top-24 h-64 w-64 rounded-full bg-emerald-400/12 blur-3xl" />
        <div className="animate-float-delayed absolute right-[-5rem] top-16 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="animate-float-soft absolute bottom-0 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-violet-400/10 blur-3xl" />
      </div>

      <section className="flex min-h-screen w-full flex-col justify-center gap-14 px-6 py-16 lg:px-10 xl:px-12">
        <div className="grid items-center gap-12 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="space-y-8 animate-rise-in">
            <div className="glass-panel inline-flex items-center gap-4 rounded-full border border-white/10 bg-white/5 px-4 py-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950/80 shadow-lg shadow-emerald-500/10">
                <Image
                  src="/vercel.svg"
                  alt="Logo Catatan Keuangan"
                  width={28}
                  height={28}
                  priority
                  className="h-7 w-7"
                />
              </span>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-200">
                  Catatan Keuangan
                </p>
                <p className="text-sm text-slate-300">
                  Ruang catatan yang terasa lebih tenang dan rapi.
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-6xl">
                Catatan uang harian yang rapi, ringan, dan enak dilihat.
              </h1>

              <p className="max-w-2xl text-lg leading-8 text-slate-300">
                Dari login sampai dashboard, semuanya dirapikan agar mencatat
                pemasukan, pengeluaran, dan kategori terasa cepat tanpa terlihat
                seperti template bawaan.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              {session ? (
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-emerald-300"
                >
                  Buka dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/register"
                    className="inline-flex items-center justify-center rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-emerald-300"
                  >
                    Mulai mencatat
                  </Link>

                  <Link
                    href="/login"
                    className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/10"
                  >
                    Saya sudah punya akun
                  </Link>
                </>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              {heroSignals.map((item) => (
                <span
                  key={item.label}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200"
                >
                  {item.label}
                </span>
              ))}
            </div>
          </div>

          <div className="w-full animate-rise-in lg:ml-auto">
            <div className="glow-ring rounded-[34px] bg-[linear-gradient(140deg,rgba(16,185,129,0.16),rgba(34,211,238,0.08),rgba(15,23,42,0.92))] p-[1px]">
              <div className="glass-panel rounded-[33px] border border-white/10 bg-slate-950/85 p-6 backdrop-blur">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-200">
                      Preview pengalaman
                    </p>
                    <h2 className="mt-3 text-2xl font-semibold text-white">
                      Semua bagian utama terasa lebih rapi dan mudah dipindai.
                    </h2>
                    <p className="mt-2 max-w-md text-sm leading-7 text-slate-300">
                      Ringkasan, transaksi terbaru, dan kategori sekarang punya
                      ritme visual yang lebih tertata.
                    </p>
                  </div>

                  <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-xs font-medium text-emerald-100">
                    Demo tampilan
                  </span>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                    <p className="text-sm text-slate-400">Saldo tersedia</p>
                    <p className="mt-2 text-2xl font-semibold text-emerald-300">
                      Rp8.450.000
                    </p>
                    <p className="mt-2 text-sm text-slate-400">
                      Ringkasan cepat yang langsung terlihat saat dashboard dibuka.
                    </p>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                    <p className="text-sm text-slate-400">Kategori aktif</p>
                    <p className="mt-2 text-2xl font-semibold text-cyan-300">
                      12
                    </p>
                    <p className="mt-2 text-sm text-slate-400">
                      Daftar kategori yang siap dipilih saat mencatat transaksi.
                    </p>
                  </div>
                </div>

                <div className="mt-4 rounded-3xl border border-white/10 bg-white/5 p-5">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-white">
                        Aktivitas bulan ini
                      </p>
                      <p className="mt-1 text-sm text-slate-400">
                        Ringkas, mudah dibaca, dan tetap nyaman dilihat.
                      </p>
                    </div>

                    <p className="text-lg font-semibold text-violet-300">
                      27 transaksi
                    </p>
                  </div>
                </div>

                <div className="mt-6 rounded-3xl border border-white/10 bg-slate-900/70 p-5">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-white">
                        Transaksi terbaru
                      </p>
                      <p className="mt-1 text-sm text-slate-400">
                        Tiga contoh item yang tampil lebih rapi di daftar transaksi.
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    {previewTransactions.map((transaction) => (
                      <div
                        key={transaction.title}
                        className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-4"
                      >
                        <div>
                          <p className="font-medium text-white">
                            {transaction.title}
                          </p>
                          <p className="mt-1 text-sm text-slate-400">
                            {transaction.meta}
                          </p>
                        </div>

                        <p className={`text-sm font-semibold ${transaction.tone}`}>
                          {transaction.amount}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {heroFeatures.map((item) => (
            <article
              key={item.title}
              className="glass-panel hover-lift rounded-3xl border border-white/10 bg-white/5 p-6"
            >
              <h2 className="text-lg font-semibold text-white">{item.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
