const authErrorMessages: Record<string, string> = {
  AccessDenied: "Akses ditolak. Coba ulangi proses login Anda.",
  Configuration: "Konfigurasi auth belum lengkap. Periksa file .env Anda.",
  CredentialsSignin: "Email atau password yang Anda masukkan tidak cocok.",
  OAuthAccountNotLinked:
    "Email ini sudah terdaftar dengan metode login lain. Gunakan metode yang sama seperti sebelumnya.",
  OAuthCallback: "Login Google gagal diselesaikan. Silakan coba lagi.",
  OAuthCreateAccount:
    "Akun Google tidak dapat dibuat saat ini. Silakan coba beberapa saat lagi.",
  OAuthSignin: "Gagal memulai login Google. Periksa konfigurasi OAuth Anda.",
  SessionRequired: "Silakan login terlebih dahulu untuk membuka halaman ini.",
};

export function getAuthErrorMessage(code?: string) {
  if (!code) {
    return undefined;
  }

  return (
    authErrorMessages[code] ??
    "Terjadi kendala saat proses login. Silakan coba lagi."
  );
}
