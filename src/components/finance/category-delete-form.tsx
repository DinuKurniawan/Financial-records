"use client";

import { useActionState } from "react";
import type { CategoryFormState } from "@/app/dashboard/actions";
import { PendingButton } from "@/components/finance/pending-button";

type CategoryDeleteAction = (
  state: CategoryFormState,
  formData: FormData,
) => Promise<CategoryFormState>;

type CategoryDeleteFormProps = {
  action: CategoryDeleteAction;
  categoryId: string;
};

const initialState: CategoryFormState = {
  status: "idle",
};

export function CategoryDeleteForm({
  action,
  categoryId,
}: CategoryDeleteFormProps) {
  const [state, formAction] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex flex-col items-end gap-2">
      <input type="hidden" name="categoryId" value={categoryId} />
      <PendingButton
        idleLabel="Hapus"
        pendingLabel="Menghapus..."
        className="inline-flex items-center justify-center rounded-full border border-rose-400/20 bg-rose-400/10 px-4 py-2 text-sm font-semibold text-rose-100 transition hover:bg-rose-400/20 disabled:cursor-not-allowed disabled:opacity-70"
      />

      {state.status === "error" && state.message ? (
        <p className="max-w-48 text-right text-xs leading-5 text-rose-200">
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
