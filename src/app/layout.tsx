import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Catatan Keuangan",
    template: "%s | Catatan Keuangan",
  },
  description:
    "Fondasi website catatan keuangan berbasis Next.js fullstack dengan login, register, dan Google OAuth.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
