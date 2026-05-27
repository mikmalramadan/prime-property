# Panduan Superadmin — Prime Property

Dokumen ini disusun khusus bagi pemegang peran **Superadmin**. Peran Superadmin memiliki hak akses absolut terhadap seluruh platform manajemen Prime Property, termasuk mengelola agen/admin lainnya dan mengakses riwayat audit secara menyeluruh.

---

## 1. Cara Setup Project (Bagi Pengembang/Superadmin Teknis)

Jika Anda ingin menjalankan proyek Prime Property di server lokal atau server baru, ikuti panduan berikut:

1. **Prasyarat**: Pastikan Node.js 18+ terpasang, dan Anda memiliki akses ke Dashboard Supabase.
2. **Kloning Proyek**: 
   ```bash
   git clone <url-repo>
   cd prime-property
   npm install
   ```
3. **Konfigurasi Environment**:
   Salin file `.env.example` menjadi `.env.local` dan masukkan kunci rahasia (*secret key*) Supabase Anda:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://<project-id>.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
   SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
   
   # Untuk fitur Rate Limiting (Opsional)
   UPSTASH_REDIS_REST_URL=https://...
   UPSTASH_REDIS_REST_TOKEN=...
   ```
4. **Seeding Data (Opsional tapi Direkomendasikan)**:
   Gunakan skrip seed untuk secara otomatis mengisi database dengan 50 properti contoh dan akun Superadmin bawaan.
   ```bash
   node --env-file=.env.local scripts/seed.mjs
   ```
5. **Jalankan Aplikasi**:
   ```bash
   npm run dev
   ```
   Akses `http://localhost:3000/agent/login` dan gunakan *Credentials* hasil seeding.

---

## 2. Cara Tambah Properti

Sebagai agen atau Superadmin, Anda dapat memasukkan *listing* properti (Ruko atau Villa) baru ke dalam sistem yang akan langsung tayang ke publik.

1. Buka halaman **Dashboard** setelah berhasil *Login*.
2. Pada *Sidebar* menu kiri, klik menu **Properti**.
3. Klik tombol emas **"Tambah Properti"** di kanan atas halaman tabel.
4. Isi kelengkapan data properti:
   - **Nama Properti & Group**: Identifikasi nama Ruko/Villa.
   - **Dimensi**: Masukkan Lebar, Panjang, dan Tingkat (lantai).
   - **Harga**: Masukkan dalam satuan Rupiah (angka murni tanpa titik).
   - **Kawasan & Hadap**: Anda bisa memilih lebih dari satu kawasan (Krakatau, Pancing, dll.) dan arah hadap (Utara, Selatan, dll.). *Tekan tombol Enter* pada kolom kawasan jika ingin mengetik manual kawasan baru.
   - **Status & Siap**: Tentukan apakah statusnya *In Stock / Sold Out* dan apakah *Siap Huni / Renovasi*.
5. Tekan **"Simpan"** untuk kembali ke daftar properti, atau tekan **"Simpan & Tambah Lagi"** jika Anda ingin memasukkan data lainnya tanpa menutup *form*.

---

## 3. Cara Kelola Akun Admin

Fitur **Kelola Admin** **HANYA** bisa diakses jika Anda memegang peran `superadmin`. Admin biasa tidak akan melihat menu ini.

1. Pada menu *Sidebar*, klik **Kelola Admin**.
2. Anda akan melihat tabel berisi seluruh akun agen yang terdaftar.
3. **Membuat Admin Baru**: 
   - Klik tombol **"Buat Akun Admin"**. Masukkan Nama, Email, dan Password.
   - Akun tersebut akan segera bisa digunakan untuk *login* dan mengurus properti.
4. **Membekukan Akun (Disable)**:
   - Jika seorang agen *resign* atau diberhentikan, Anda dapat mengklik status **"Aktif"** untuk mematikan akses agen tersebut (*Non-Aktif*). Mereka tidak akan bisa *login* lagi.
5. **Mereset Kata Sandi (Password)**:
   - Klik ikon **Kunci** pada salah satu baris Admin.
   - Konfirmasi pengiriman email *Reset Password*. Link *reset* akan terkirim langsung dari server Supabase ke kotak masuk agen terkait.

---

## 4. Cara Lihat Audit Log

**Audit Log** adalah fitur lacak rekam (buku besar transparan) yang mencatat **"Siapa melakukan Apa, pada Kapan, dan Apa yang diubah"**. Sama seperti Manajemen Admin, fitur ini **eksklusif** untuk Superadmin.

1. Pada menu *Sidebar*, klik **Audit Log**.
2. Anda dapat melihat daftar riwayat secara kronologis (Terbaru di atas).
3. Tabel akan menyajikan aksi:
   - **Buat (Create)**: Properti baru dimasukkan ke sistem.
   - **Edit (Update)**: Properti yang ada mengalami perubahan data.
   - **Hapus (Delete)**: Properti diarsip/dibuang.
4. **Melihat Detail Perubahan (Payload JSON)**:
   - Klik **"Detail"** (ikon dokumen) pada salah satu *log*.
   - Laci panel kanan akan terbuka dan memperlihatkan blok data *JSON Payload*. Anda bisa dengan jelas melihat perbedaan data properti sebelum dan sesudah diedit oleh admin terkait.
