# Catatan Keuangan

Starter project website catatan keuangan berbasis Next.js fullstack dengan:

- Login email + password
- Register akun baru
- Login menggunakan Google
- Kelola kategori pemasukan dan pengeluaran per akun
- Tambah dan hapus transaksi pemasukan/pengeluaran
- Ringkasan saldo dan statistik bulan berjalan
- Prisma + PostgreSQL untuk development dan production
- Dashboard yang sudah diproteksi auth

## Stack

- Next.js App Router
- TypeScript
- NextAuth
- Prisma
- PostgreSQL
- Tailwind CSS

## Menjalankan project

1. Salin environment file:

```bash
copy .env.example .env
```

2. Siapkan database PostgreSQL.

Anda bisa memakai PostgreSQL lokal, Neon, Supabase, atau database Postgres lain yang bisa diakses dari Vercel.

3. Isi nilai berikut di `.env`:

- `DATABASE_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

4. Jalankan migrasi database:

```bash
npm run db:migrate
```

5. Jalankan development server:

```bash
npm run dev
```

6. Buka [http://localhost:3000](http://localhost:3000).

## Google OAuth

Tambahkan callback URL berikut di Google Cloud Console:

```text
http://localhost:3000/api/auth/callback/google
```

Untuk production di Vercel, tambahkan juga:

```text
https://YOUR_DOMAIN/api/auth/callback/google
```

## Deploy ke Vercel

1. Buat project di Vercel dan hubungkan repository/folder project ini.

2. Buat database PostgreSQL yang bisa diakses dari Vercel.

3. Tambahkan environment variables berikut di Vercel:

- `DATABASE_URL`
- `NEXTAUTH_URL` dengan domain production Anda, misalnya `https://catatan-keuangan.vercel.app`
- `NEXTAUTH_SECRET`
- `GOOGLE_CLIENT_ID` dan `GOOGLE_CLIENT_SECRET` jika ingin mengaktifkan login Google

4. Deploy ke production.

File `vercel.json` sudah menjalankan `npm run db:deploy && npm run build`, jadi migrasi Prisma akan diterapkan otomatis saat deployment.

5. Jika memakai Google OAuth, pastikan Authorized redirect URI di Google Cloud sudah memakai domain production.

Jika Anda ingin membawa data lama dari SQLite, lakukan migrasi data manual ke PostgreSQL sebelum deploy production.

## Script penting

```bash
npm run dev
npm run lint
npm run build
npm run db:generate
npm run db:migrate
npm run db:deploy
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

- Gunakan PostgreSQL yang sama pola konfigurasinya untuk local dan production supaya perilaku auth dan transaksi konsisten.
- Setup ini siap untuk deployment Vercel multi-user karena tidak bergantung pada file database lokal.
- MVP saat ini fokus pada transaksi pribadi user yang sedang login.
