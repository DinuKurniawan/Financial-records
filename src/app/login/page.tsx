import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthCard } from "@/components/auth/auth-card";
import { LoginForm } from "@/components/auth/login-form";
import { getCurrentSession, isGoogleProviderEnabled } from "@/lib/auth";
import { getAuthErrorMessage } from "@/lib/auth-errors";
import { getSafeCallbackUrl, pickFirstValue } from "@/lib/url";

type LoginPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await getCurrentSession();

  if (session) {
    redirect("/dashboard");
  }

  const params = await searchParams;
  const callbackUrl = getSafeCallbackUrl(params.callbackUrl);
  const error = getAuthErrorMessage(pickFirstValue(params.error));
  const registered = pickFirstValue(params.registered) === "1";

  return (
    <AuthCard
      title="Masuk dan lanjutkan ritme finansial Anda"
      description="Buka dashboard yang lebih hidup, lihat saldo bergerak, dan catat transaksi tanpa kehilangan momentum."
      footer={
        <p>
          Belum punya akun?{" "}
          <Link href="/register" className="font-semibold text-emerald-300">
            Buat akun dalam hitungan detik
          </Link>
        </p>
      }
    >
      <LoginForm
        callbackUrl={callbackUrl}
        googleEnabled={isGoogleProviderEnabled}
        initialError={error}
        registered={registered}
      />
    </AuthCard>
  );
}
