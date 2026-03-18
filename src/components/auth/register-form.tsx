"use client";

import { FormEvent, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { GoogleAuthButton } from "@/components/auth/google-auth-button";

type RegisterFormProps = {
  callbackUrl: string;
  googleEnabled: boolean;
};

type RegisterResponse = {
  message?: string;
};

export function RegisterForm({
  callbackUrl,
  googleEnabled,
}: RegisterFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(undefined);

    startTransition(async () => {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const payload = (await response.json()) as RegisterResponse;

      if (!response.ok) {
        setError(payload.message ?? "Registrasi gagal. Silakan coba lagi.");
        return;
      }

      router.push(
        `/login?registered=1&callbackUrl=${encodeURIComponent(callbackUrl)}`,
      );
      router.refresh();
    });
  };

  return (
    <div className="space-y-6 animate-rise-in">
      {error ? (
        <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
          {error}
        </div>
      ) : null}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-200" htmlFor="name">
            Nama
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              setError(undefined);
            }}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-400 focus:border-emerald-300/70"
            placeholder="Nama lengkap"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-200" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setError(undefined);
            }}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-400 focus:border-emerald-300/70"
            placeholder="nama@email.com"
            required
          />
        </div>

        <div className="space-y-2">
          <label
            className="text-sm font-medium text-slate-200"
            htmlFor="password"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              setError(undefined);
            }}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-400 focus:border-emerald-300/70"
            placeholder="Minimal 8 karakter"
            minLength={8}
            required
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="flex w-full items-center justify-center rounded-2xl bg-emerald-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isPending ? "Menyiapkan akun..." : "Buat akun & mulai mencatat"}
        </button>
      </form>

      <div className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-slate-400">
        <span className="h-px flex-1 bg-white/10" />
        <span>atau</span>
        <span className="h-px flex-1 bg-white/10" />
      </div>

      {googleEnabled ? (
        <GoogleAuthButton
          callbackUrl={callbackUrl}
          label="Lanjut dengan Google"
          disabled={isPending}
        />
      ) : (
        <p className="rounded-2xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
          Tombol Google akan aktif begitu `GOOGLE_CLIENT_ID` dan
          `GOOGLE_CLIENT_SECRET` tersedia.
        </p>
      )}
    </div>
  );
}
