"use client";

import { signIn } from "next-auth/react";
import { useTransition } from "react";

type GoogleAuthButtonProps = {
  callbackUrl: string;
  label: string;
  disabled?: boolean;
};

export function GoogleAuthButton({
  callbackUrl,
  label,
  disabled,
}: GoogleAuthButtonProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={disabled || isPending}
      onClick={() => {
        startTransition(() => {
          void signIn("google", {
            callbackUrl,
          });
        });
      }}
      className="flex w-full items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {isPending ? "Mengalihkan ke Google..." : label}
    </button>
  );
}
