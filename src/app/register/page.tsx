import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthCard } from "@/components/auth/auth-card";
import { RegisterForm } from "@/components/auth/register-form";
import { getCurrentSession, isGoogleProviderEnabled } from "@/lib/auth";
import { getSafeCallbackUrl } from "@/lib/url";

type RegisterPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function RegisterPage({
  searchParams,
}: RegisterPageProps) {
  const session = await getCurrentSession();

  if (session) {
    redirect("/dashboard");
  }

  const params = await searchParams;
  const callbackUrl = getSafeCallbackUrl(params.callbackUrl);

  return (
    <AuthCard
      title="Bangun ruang finansial pribadi Anda"
      description="Mulai dengan akun baru, aktifkan kategori favorit Anda, lalu rasakan dashboard yang lebih rapi sejak transaksi pertama."
      footer={
        <p>
          Sudah punya akun?{" "}
          <Link href="/login" className="font-semibold text-emerald-300">
            Masuk dan lanjutkan pencatatan
          </Link>
        </p>
      }
    >
      <RegisterForm
        callbackUrl={callbackUrl}
        googleEnabled={isGoogleProviderEnabled}
      />
    </AuthCard>
  );
}
