"use client";

import { FormEvent, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { GoogleAuthButton } from "@/components/auth/google-auth-button";
import { getAuthErrorMessage } from "@/lib/auth-errors";
import { toInternalPath } from "@/lib/url";

type LoginFormProps = {
  callbackUrl: string;
  googleEnabled: boolean;
  initialError?: string;
  registered?: boolean;
};

export function LoginForm({
  callbackUrl,
  googleEnabled,
  initialError,
  registered = false,
}: LoginFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(initialError);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(undefined);

    startTransition(async () => {
      const result = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
        callbackUrl,
      });

      if (!result) {
        setError("Terjadi kendala saat login. Silakan coba lagi.");
        return;
      }

      if (result.error) {
        setError(getAuthErrorMessage(result.error));
        return;
      }

      router.push(toInternalPath(result.url, callbackUrl));
      router.refresh();
    });
  };

  return (
    <div className="space-y-6 animate-rise-in">
      {registered ? (
        <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
          Akun Anda sudah siap. Masuk sekarang dan mulai rapikan arus kas harian.
        </div>
      ) : null}

      {error ? (
        <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
          {error}
        </div>
      ) : null}

      <form className="space-y-4" onSubmit={handleSubmit}>
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
            autoComplete="current-password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              setError(undefined);
            }}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-400 focus:border-emerald-300/70"
            placeholder="Masukkan password"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="flex w-full items-center justify-center rounded-2xl bg-emerald-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isPending ? "Membuka dashboard..." : "Masuk ke dashboard"}
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
          Login Google belum aktif. Saat kredensial di `.env` sudah lengkap,
          tombol ini akan langsung siap dipakai.
        </p>
      )}
    </div>
  );
}
