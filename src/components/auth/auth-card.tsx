import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

type AuthCardProps = {
  title: string;
  description: string;
  children: ReactNode;
  footer: ReactNode;
};

export function AuthCard({
  title,
  description,
  children,
  footer,
}: AuthCardProps) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-16">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="animate-float-soft absolute left-[8%] top-24 h-56 w-56 rounded-full bg-emerald-400/12 blur-3xl" />
        <div className="animate-float-delayed absolute right-[10%] top-20 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />
      </div>

      <div className="glow-ring glass-panel animate-rise-in w-full max-w-md rounded-[32px] border border-white/10 bg-slate-950/82 p-8 backdrop-blur">
        <div className="space-y-5">
          <Link
            href="/"
            className="inline-flex items-center gap-4 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm transition hover:bg-white/10"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900/80 shadow-lg shadow-emerald-500/10">
              <Image
                src="/vercel.svg"
                alt="Logo Catatan Keuangan"
                width={24}
                height={24}
                className="h-6 w-6"
              />
            </span>

            <span className="text-left">
              <span className="block text-xs font-semibold uppercase tracking-[0.26em] text-emerald-200">
                Catatan Keuangan
              </span>
              <span className="block text-sm text-slate-300">
                Tempat arus uang terasa lebih rapi.
              </span>
            </span>
          </Link>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200">
              Masuk dengan lebih tenang
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-white">{title}</h1>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              {description}
            </p>
          </div>
        </div>

        <div className="mt-8">{children}</div>

        <div className="mt-8 border-t border-white/10 pt-6 text-sm text-slate-300">
          {footer}
        </div>
      </div>
    </main>
  );
}
