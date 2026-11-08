# Panduan menjalankan Jamal Jepret dengan Supabase

## 1. Konfigurasi environment

Salin `.env.example` menjadi `.env`, lalu isi:

- `EXPO_PUBLIC_SUPABASE_URL`: Project URL dari Supabase.
- `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: Publishable key dari Supabase.

Jangan pernah memasukkan `service_role` key ke aplikasi Expo/React Native karena variabel `EXPO_PUBLIC_*` dapat dibaca dari aplikasi klien.

## 2. Prasyarat data database

Aplikasi menggunakan tabel `profiles`, `branches`, `bikes`, `rentals`, `rental_items`, `expenses`, `maintenance`, dan `pricing_rules` sesuai skema yang disiapkan.

Sebelum masuk sebagai admin, pastikan:

1. Ada minimal satu baris `branches` dengan `is_active = true`.
2. Sepeda memiliki `branch_id` yang mengarah ke cabang aktif.
3. `bikes.status` menggunakan nilai `Tersedia`, `Sedang Disewa`, atau `Perawatan`.
4. Ada aturan tarif aktif di `pricing_rules` untuk kombinasi `customer_type` dan `day_type` yang digunakan. Jika belum ada, aplikasi memakai tarif fallback pada `src/constants/adminTypes.ts`.
5. Trigger `on_auth_user_created` menjalankan `public.handle_new_user()` seperti yang sudah diperiksa. Fungsi ini menetapkan `role = 'user'`.
6. Kebijakan RLS dan hak akses kolom `profiles` tetap seperti hasil verifikasi: `anon` tidak memiliki akses, pengguna login hanya dapat mengubah `full_name` dan `phone`.

## 3. Menjalankan aplikasi

```bash
npm install
npx expo start
```

Gunakan `npx expo start --android` untuk menjalankan melalui emulator/perangkat Android yang sudah terhubung.

## 4. Alur yang sudah diarahkan ke Supabase

- Registrasi dan login menggunakan Supabase Auth.
- Profil dibuat melalui trigger dan dibaca dari `profiles`.
- Edit nama dan nomor WhatsApp disimpan ke `profiles`.
- Katalog dan detail sepeda membaca `bikes` serta `branches`.
- Inventaris admin membaca, menambah, dan memperbarui `bikes`.
- Pembuatan transaksi menyimpan `rentals` dan `rental_items`.
- Pembayaran, serah terima, dan pengembalian memperbarui data transaksi dan status sepeda.
- Kerusakan saat pengembalian membuat catatan `maintenance`.
- Pengeluaran disimpan ke `expenses`.
- Proses perawatan memperbarui `maintenance` dan status sepeda.
- Riwayat pengguna diambil berdasarkan `rentals.user_id`, bukan pencocokan nomor telepon di data demo. Saat admin membuat transaksi, aplikasi mencoba mencocokkan nomor WhatsApp dengan `profiles.phone`; jika tidak ada profil yang cocok, transaksi walk-in disimpan dengan `user_id = null` dan tidak muncul pada riwayat akun pengguna. Pastikan `rentals.user_id` nullable untuk mendukung pelanggan walk-in tanpa akun.
- Ringkasan keuangan menggunakan transaksi dan pengeluaran yang dibaca dari database.

## 5. Catatan implementasi

Operasi yang melibatkan beberapa tabel (misalnya serah terima dan pengembalian) saat ini dilakukan melalui beberapa request Supabase berurutan. Untuk konsistensi transaksi penuh, tahap penguatan berikutnya adalah memindahkannya ke PostgreSQL function/RPC agar seluruh perubahan berhasil atau dibatalkan sebagai satu transaksi database.

Tombol ekspor laporan PDF masih berupa pratinjau UI dan belum menghasilkan file PDF. Fitur ini tidak termasuk alur penyimpanan Supabase yang diubah pada tahap ini.
