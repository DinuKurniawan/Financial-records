# Catatan Keuangan

Starter project website catatan keuangan berbasis Next.js fullstack dengan:

- Login email + password
- Register akun baru
- Login menggunakan Google
- Kelola kategori pemasukan dan pengeluaran per akun
- Tambah dan hapus transaksi pemasukan/pengeluaran
- Ringkasan saldo dan statistik bulan berjalan
- Prisma + SQLite untuk development lokal
- Dashboard yang sudah diproteksi auth

## Stack

- Next.js App Router
- TypeScript
- NextAuth
- Prisma
- SQLite
- Tailwind CSS

## Menjalankan project

1. Salin environment file:

```bash
copy .env.example .env
```

2. Isi nilai berikut di `.env`:

- `NEXTAUTH_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

3. Jalankan migrasi database lokal:

```bash
npm run db:migrate
```

4. Jalankan development server:

```bash
npm run dev
```

5. Buka [http://localhost:3000](http://localhost:3000).

## Google OAuth

Tambahkan callback URL berikut di Google Cloud Console:

```text
http://localhost:3000/api/auth/callback/google
```

## Script penting

```bash
npm run dev
npm run lint
npm run build
npm run db:generate
npm run db:migrate
npm run db:studio
```

## Struktur auth yang sudah disiapkan

- `src/app/api/auth/[...nextauth]/route.ts` untuk NextAuth
- `src/app/api/auth/register/route.ts` untuk register user baru
- `src/app/login` dan `src/app/register` untuk flow auth
- `src/app/dashboard` untuk dashboard transaksi user
- `src/app/dashboard/actions.ts` untuk transaksi dan kategori
- `src/components/finance` untuk form transaksi dan panel kategori
- `src/lib/categories.ts` untuk kategori default dan validasi kategori
- `src/lib/finance.ts` untuk validasi dan formatting keuangan

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs)
- [NextAuth Documentation](https://next-auth.js.org)
- [Prisma Documentation](https://www.prisma.io/docs)

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Catatan

- SQLite dipakai sebagai default development database supaya setup awal cepat.
- Untuk production, datasource Prisma bisa dipindah ke PostgreSQL tanpa mengubah flow auth utama.
- MVP saat ini fokus pada transaksi pribadi user yang sedang login.
