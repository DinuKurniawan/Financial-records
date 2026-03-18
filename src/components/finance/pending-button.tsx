"use client";

import { useFormStatus } from "react-dom";

type PendingButtonProps = {
  idleLabel: string;
  pendingLabel: string;
  className?: string;
  disabled?: boolean;
};

const defaultClassName =
  "flex w-full items-center justify-center rounded-2xl bg-emerald-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-70";

export function PendingButton({
  idleLabel,
  pendingLabel,
  className,
  disabled = false,
}: PendingButtonProps) {
  const { pending } = useFormStatus();
  const isDisabled = pending || disabled;

  return (
    <button
      type="submit"
      disabled={isDisabled}
      className={className ?? defaultClassName}
    >
      {pending ? pendingLabel : idleLabel}
    </button>
  );
}
