# Prime Property

Platform digital manajemen dan pemasaran properti untuk ruko dan villa di wilayah Medan dan sekitarnya. Dibangun dengan Next.js 16, Supabase, dan Tailwind CSS.

---

## ✨ Fitur Utama

- **Landing Page Publik** — Halaman beranda, tentang kami, dan kontak yang responsif dengan animasi premium
- **Portal Agent** — Dashboard internal untuk mengelola listing properti dengan autentikasi yang aman
- **Manajemen Properti** — CRUD lengkap dengan filter, pencarian, pengurutan, dan soft-delete
- **Panel Admin** — Manajemen pengguna/agent dengan kontrol peran (admin & superadmin)
- **Audit Log** — Riwayat lengkap setiap perubahan data properti
- **Rate Limiting** — Pembatasan login (15 menit lockout) dan filter spam kontak
- **SEO-Ready** — Meta tag, sitemap, dan robots.txt otomatis

---

## 🛠️ Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Framework | [Next.js 16](https://nextjs.org) (App Router + Server Actions) |
| Database & Auth | [Supabase](https://supabase.com) (PostgreSQL + RLS) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) |
| Language | TypeScript |
| Runtime | Node.js 18+ |

---

## 🚀 Cara Menjalankan Proyek

### 1. Prasyarat

Pastikan sudah terinstall:
- **Node.js** versi 18 atau lebih baru → [nodejs.org](https://nodejs.org)
- **npm** (sudah termasuk bersama Node.js)
- Akun **Supabase** → [supabase.com](https://supabase.com)

### 2. Clone Repository

```bash
git clone <url-repository-ini>
cd prime-property
```

### 3. Install Dependensi

```bash
npm install
```

### 4. Setup Supabase

#### a. Buat Proyek Supabase Baru

1. Buka [app.supabase.com](https://app.supabase.com)
2. Klik **New Project** dan isi nama, password database, dan region
3. Tunggu hingga proyek selesai dibuat (±2 menit)

#### b. Jalankan Migrasi Database

1. Buka **SQL Editor** di dashboard Supabase Anda
2. Salin isi file `supabase/migrations/001_init.sql`
3. Tempel dan klik **Run** untuk menjalankan schema

> **Catatan:** Jika ingin mendukung format link Google Maps singkat (`maps.app.goo.gl`), jalankan juga skrip berikut di SQL Editor:
> ```sql
> ALTER TABLE properties DROP CONSTRAINT IF EXISTS properties_maps_link_check;
> ALTER TABLE properties ADD CONSTRAINT properties_maps_link_check
>   CHECK (
>     maps_link IS NULL OR
>     maps_link LIKE '%google.com/maps%' OR
>     maps_link LIKE '%maps.app.goo.gl%'
>   );
> ```

#### c. Buat Pengguna Pertama (Superadmin)

1. Di dashboard Supabase, buka **Authentication → Users**
2. Klik **Add User** dan isi email serta password
3. Salin `UUID` pengguna yang baru dibuat
4. Buka **SQL Editor** dan jalankan:
   ```sql
   INSERT INTO profiles (id, email, role)
   VALUES ('<uuid-pengguna>', '<email>', 'superadmin');
   ```

#### d. Seeding Data Dummy (Opsional)

Jika Anda ingin langsung mengisi database dengan 50+ properti dummy untuk keperluan testing, jalankan skrip seed (membutuhkan Node 20.6+):

```bash
node --env-file=.env.local scripts/seed.mjs
```

Skrip ini akan secara otomatis membuatkan akun Superadmin bawaan:
- **Email:** `superadmin@primeproperty.id`
- **Password:** `Password123!`

### 5. Konfigurasi Environment Variables

Buat file `.env.local` di root proyek:

```bash
cp .env.example .env.local   # jika ada contohnya
# atau buat manual
```

Isi dengan kredensial dari dashboard Supabase Anda (**Settings → API**):

```env
NEXT_PUBLIC_SUPABASE_URL=https://<project-id>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-public-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-secret-key>
```

| Variable | Lokasi di Supabase | Kegunaan |
|----------|--------------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Settings → API → Project URL | URL endpoint Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Settings → API → anon public | Akses publik (RLS aktif) |
| `SUPABASE_SERVICE_ROLE_KEY` | Settings → API → service_role secret | Akses server-side penuh (bypass RLS) |

> ⚠️ **Jangan commit file `.env.local`** — file ini sudah terdaftar di `.gitignore`
>
> 🔒 **`SUPABASE_SERVICE_ROLE_KEY` bersifat rahasia** — jangan pernah diekspos di sisi client (`NEXT_PUBLIC_*`). Key ini hanya digunakan di Server Actions dan API routes.

### 6. Jalankan Development Server

```bash
npm run dev
```

Buka browser dan akses: **[http://localhost:3000](http://localhost:3000)**

- Halaman publik: `http://localhost:3000`
- Portal agent: `http://localhost:3000/agent/login`

---

## 📁 Struktur Proyek

```
prime-property/
├── public/                  # Aset statis (logo, gambar background)
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── (public)/        # Halaman publik (beranda, tentang, kontak)
│   │   ├── agent/           # Portal agent (login, dashboard)
│   │   └── layout.tsx       # Root layout & metadata global
│   ├── components/          # Komponen UI yang dapat digunakan ulang
│   │   ├── admin/           # Komponen panel admin
│   │   ├── contact/         # Form kontak
│   │   ├── landing/         # Komponen halaman beranda
│   │   ├── layout/          # Header, footer, sidebar
│   │   ├── properties/      # Tabel, form, filter properti
│   │   └── ui/              # Komponen generik (badge, card, dll.)
│   ├── lib/                 # Utility (Supabase client, format, helper)
│   └── types/               # Definisi TypeScript
└── supabase/
    └── migrations/          # File migrasi database SQL
```

---

## 📦 Scripts yang Tersedia

```bash
npm run dev      # Jalankan server development (hot reload)
npm run build    # Build untuk production
npm run start    # Jalankan build production secara lokal
npm run lint     # Cek kualitas kode dengan ESLint
```

---

## 🗄️ Skema Database

| Tabel | Deskripsi |
|-------|-----------|
| `profiles` | Data pengguna/agent (terhubung ke Supabase Auth) |
| `properties` | Data listing properti dengan soft-delete |
| `audit_logs` | Log setiap perubahan properti (create/update/delete) |

**Row Level Security (RLS):**
- Publik hanya dapat **membaca** properti yang belum dihapus
- Pengguna terautentikasi mendapat akses **penuh** ke semua data

---

## 🌐 Routes

| Path | Akses | Keterangan |
|------|-------|-----------|
| `/` | Publik | Halaman beranda |
| `/tentang-kami` | Publik | Profil perusahaan |
| `/kontak` | Publik | Form kontak |
| `/agent/login` | Publik | Halaman masuk portal |
| `/agent/dashboard` | Agent | Overview & statistik |
| `/agent/dashboard/properties` | Agent | Daftar properti |
| `/agent/dashboard/properties/new` | Agent | Tambah properti |
| `/agent/dashboard/admin` | Admin/Superadmin | Manajemen pengguna |
| `/agent/dashboard/audit` | Admin/Superadmin | Log audit |

---

## 📄 Lisensi

Proyek ini bersifat privat dan dikembangkan untuk keperluan internal **Prime Property**.
