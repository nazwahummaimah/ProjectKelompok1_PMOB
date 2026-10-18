# Design System — Sistem Penyewaan Sepeda Jamal Jepret

## 1. Overview

### 1.1 Nama Aplikasi

**Sistem Penyewaan Sepeda Jamal Jepret**

### 1.2 Deskripsi

Sistem Penyewaan Sepeda Jamal Jepret merupakan aplikasi mobile untuk mendukung operasional usaha penyewaan sepeda yang memiliki dua cabang dan sekitar 62 unit sepeda.

Aplikasi menyediakan katalog sepeda, informasi tarif dan paket sewa, akses pemindaian QR Code untuk proses durasi sewa, autentikasi pengguna, serta fitur operasional untuk pengelolaan inventaris, transaksi, pengembalian, pembayaran, dan riwayat penyewaan sesuai hak akses.

### 1.3 Tujuan Desain

- Menyajikan informasi usaha dan katalog sepeda secara jelas kepada pengunjung.
- Memudahkan pengguna menemukan tarif, paket, dan alamat cabang.
- Menyediakan halaman pemindaian QR Code yang praktis tanpa menghilangkan navigasi utama.
- Mempermudah proses masuk dan registrasi akun.
- Mendukung proses penyewaan langsung di lokasi melalui alur yang sesuai dengan operasional usaha.
- Menjaga konsistensi tampilan, keamanan interaksi, dan kemudahan penggunaan.

### 1.4 Platform

- Platform utama: aplikasi mobile Android.
- Orientasi utama: portrait.
- Bahasa antarmuka: Bahasa Indonesia.
- Mata uang: Rupiah (IDR).
- Gaya visual: modern, bersih, ramah, dan berorientasi pada aktivitas bersepeda.

## 2. Design Principles

### 2.1 Public First

Pengunjung dapat mengakses halaman Home dan melihat informasi sepeda, tarif, paket, serta alamat cabang tanpa harus login.

### 2.2 Simple Navigation

Navigasi utama menggunakan bottom navigation dengan tiga menu: Home, Durasi Sewa, dan Login.

### 2.3 Walk-in Rental

Penyewaan dilakukan langsung di lokasi usaha. Aplikasi tidak menyediakan pemesanan mandiri berdasarkan tanggal dan waktu untuk penggunaan di masa mendatang.

### 2.4 Clear Information

Informasi tarif, ketersediaan unit, status, dan instruksi pemindaian harus mudah dipahami tanpa bergantung pada warna saja.

### 2.5 Operational Efficiency

Alur yang berkaitan dengan pemindaian, autentikasi, dan transaksi harus dibuat singkat, jelas, dan minim langkah yang tidak diperlukan.

### 2.6 Consistency

Semua halaman menggunakan sistem warna, tipografi, jarak, ikon, dan komponen yang konsisten.

## 3. Visual Identity

### 3.1 Design Direction

Gunakan gaya visual yang memberikan kesan segar, aktif, terpercaya, dan profesional.

Karakter visual:

- Fresh: identitas yang berkaitan dengan kegiatan bersepeda dan aktivitas luar ruang.
- Friendly: mudah dipahami oleh pelanggan dengan berbagai latar belakang.
- Clean: tampilan rapi dan tidak dipenuhi elemen dekoratif.
- Reliable: informasi transaksi dan ketersediaan unit ditampilkan dengan jelas.

### 3.2 Color Palette

| Token | Hex | Penggunaan |
|---|---|---|
| Primary | `#2E7D32` | Tombol utama, ikon aktif, identitas merek |
| Primary Dark | `#1B5E20` | Penekanan dan interaksi |
| Primary Light | `#E8F5E9` | Latar sorotan dan status positif |
| Secondary | `#F9A825` | Aksen dan perhatian |
| Background | `#F7F8FA` | Latar halaman |
| Surface | `#FFFFFF` | Kartu, formulir, dan panel |
| Text Primary | `#212121` | Judul dan teks utama |
| Text Secondary | `#616161` | Deskripsi dan teks pendukung |
| Border | `#E0E0E0` | Garis pembatas |
| Success | `#2E7D32` | Operasi berhasil |
| Warning | `#EF6C00` | Peringatan |
| Error | `#C62828` | Kesalahan dan kondisi kritis |
| Info | `#1565C0` | Informasi dan petunjuk |

Gunakan warna utama hijau sebagai identitas aplikasi. Warna status harus disertai label teks yang jelas.

### 3.3 Typography

Gunakan Inter sebagai font utama, dengan sans-serif bawaan platform sebagai fallback.

| Style | Ukuran | Weight |
|---|---:|---|
| Display | 28 sp | Bold |
| Heading 1 | 24 sp | Bold |
| Heading 2 | 20 sp | SemiBold |
| Heading 3 | 18 sp | SemiBold |
| Body Large | 16 sp | Regular |
| Body | 14 sp | Regular |
| Label | 12 sp | Medium |
| Button | 14–16 sp | SemiBold |

### 3.4 Spacing and Shape

Gunakan sistem spacing berbasis kelipatan 4 dp.

- Padding horizontal halaman: 16 dp.
- Jarak antarseksi: 24–32 dp.
- Jarak antarkomponen: 8–16 dp.
- Radius kartu: 12 dp.
- Radius tombol: 10–12 dp.
- Radius input: 8–10 dp.
- Target area sentuh: sekitar 44–48 dp atau lebih.

## 4. Public Navigation

### 4.1 Bottom Navigation

Semua halaman publik menggunakan bottom navigation yang konsisten di bagian bawah layar.

Terdapat tiga menu utama:

| Menu | Ikon | Tujuan |
|---|---|---|
| Home | `home` | Informasi usaha, katalog sepeda, tarif, paket, dan cabang |
| Durasi Sewa | `scan-line` | Membuka antarmuka pemindaian QR Code |
| Login | `user-round` | Masuk ke akun atau menuju registrasi |

Ketentuan navigasi:

- Bottom navigation tetap terlihat pada ketiga halaman publik.
- Ikon dan label menu harus ditampilkan bersama.
- Menu aktif menggunakan warna `Primary`.
- Menu tidak aktif menggunakan warna netral.
- Perpindahan menu tidak menghilangkan navigasi bawah.
- Konten halaman harus memiliki ruang bawah yang cukup agar tidak tertutup bottom navigation.
- Jika kamera atau pemindaian sedang aktif, navigasi tetap terlihat sesuai rancangan dan tidak menutupi area pemindaian.

### 4.2 Public Page Flow

```text
Public Application
│
├── Home
│   ├── Hero Section
│   ├── Daftar Unit Sepeda
│   ├── Detail Unit Sepeda
│   ├── Tarif dan Paket Sewa
│   ├── Informasi Cabang
│   └── Informasi dan Ketentuan Sewa
│
├── Durasi Sewa
│   ├── Area Pemindaian QR
│   ├── Instruksi Pemindaian
│   ├── Status Izin Kamera
│   └── Hasil Pemindaian
│
└── Login
    ├── Form Login
    └── Registrasi
```

## 5. Home Page

### 5.1 Tujuan

Home merupakan halaman utama yang pertama kali dilihat pengunjung. Halaman ini harus memberikan gambaran tentang layanan Jamal Jepret, unit sepeda yang tersedia, tarif sewa, dan lokasi cabang.

### 5.2 Struktur Konten

Urutan konten Home dari atas ke bawah:

1. Header atau identitas usaha.
2. Hero Section.
3. Section Daftar Unit Sepeda.
4. Section Tarif Sewa dan Paket.
5. Section Informasi Cabang.
6. Section Cara Menyewa.
7. Section Ketentuan Penyewaan.
8. Footer atau informasi penutup.

### 5.3 Header

Komponen:

- Logo atau nama Jamal Jepret.
- Identitas visual yang konsisten dengan halaman lain.
- Hindari menambahkan menu navigasi horizontal tambahan karena navigasi utama telah tersedia di bagian bawah.

Header dapat menggunakan latar putih dan pemisah tipis dari konten utama.

### 5.4 Hero Section

**Tujuan:** memperkenalkan layanan penyewaan sepeda dan mengarahkan pengunjung ke informasi yang relevan.

Komponen:

- Judul utama yang singkat dan menarik.
- Deskripsi singkat tentang layanan.
- Ilustrasi atau foto sepeda.
- Tombol `Lihat Unit Sepeda`.
- Tombol sekunder `Lihat Tarif`.

Contoh konten:

**Jelajahi Sekitar dengan Sepeda Favoritmu**

Nikmati pengalaman bersepeda bersama Jamal Jepret. Pilih jenis sepeda yang sesuai dan lihat tarif sewa sebelum datang ke cabang kami.

Tombol utama mengarahkan pengguna ke section katalog sepeda, sedangkan tombol sekunder mengarahkan pengguna ke section tarif.

Hero tidak boleh menjanjikan pemesanan online karena proses penyewaan dilakukan langsung di lokasi.

### 5.5 Section Daftar Unit Sepeda

**Tujuan:** menampilkan unit sepeda yang dimiliki usaha dengan informasi yang mudah dibandingkan.

Gunakan layout berbentuk card.

Setiap card menampilkan:

- Foto sepeda.
- Nama atau kode unit.
- Jenis sepeda, misalnya sepeda gunung atau sepeda lipat.
- Cabang tempat unit berada.
- Status unit.
- Tombol `Lihat Detail`.

Informasi status:

- Tersedia.
- Sedang disewa.
- Perbaikan.
- Tidak aktif, jika relevan untuk pengguna publik.

Untuk katalog publik, unit tidak aktif atau informasi operasional internal dapat disembunyikan sesuai kebutuhan bisnis.

**Aturan tampilan:**

- Gunakan rasio gambar yang konsisten.
- Nama unit dan jenis sepeda harus mudah ditemukan.
- Status harus ditampilkan dalam bentuk badge dengan teks.
- Tombol detail hanya membuka informasi unit.
- Tidak menyediakan tombol `Pesan Sekarang` atau alur reservasi mandiri.

Jika jumlah unit terlalu banyak untuk ditampilkan sekaligus, gunakan daftar yang dapat digulir dan filter sederhana.

Filter yang disarankan:

- Jenis sepeda.
- Cabang.
- Ketersediaan.

Katalog harus menggunakan data aktual dari sistem. Jika data belum berhasil dimuat, tampilkan pesan yang sesuai dan jangan mengasumsikan semua unit tersedia.

### 5.6 Detail Unit Sepeda

Ketika pengguna menekan `Lihat Detail`, tampilkan halaman detail atau modal yang sesuai dengan pola navigasi aplikasi.

Informasi:

- Foto unit.
- Nama atau kode unit.
- Jenis sepeda.
- Cabang.
- Status ketersediaan.
- Tarif atau tautan ke informasi tarif.
- Informasi tambahan yang relevan bagi pelanggan.

Detail unit tidak berfungsi sebagai formulir pemesanan.

Untuk unit yang sedang diperbaiki, tampilkan informasi bahwa unit belum dapat disewakan jika unit tersebut memang ditampilkan kepada publik.

### 5.7 Section Tarif Sewa dan Paket

**Tujuan:** membantu pengunjung memahami biaya sewa sebelum datang ke lokasi.

Tampilkan tarif per jam dalam bentuk tabel sederhana atau kartu yang mudah dibaca.

Tarif acuan awal:

| Kondisi | Pelajar | Umum |
|---|---:|---:|
| Hari biasa | Rp10.000/jam | Rp12.000/jam |
| Hari libur | Rp12.000/jam | Rp15.000/jam |

Selain tarif per jam, sediakan informasi paket berdasarkan konfigurasi bisnis:

- Paket pagi.
- Paket siang/sore.
- Paket malam.
- Paket sehari penuh.

Setiap paket menampilkan:

- Nama paket.
- Periode atau ketentuan waktu.
- Harga yang berlaku.
- Informasi singkat mengenai ketentuan paket.

Jangan menetapkan harga paket atau jam mulai dan berakhir secara asumtif. Informasi tersebut harus mengikuti data tarif resmi yang dikelola oleh usaha.

Tambahkan catatan bahwa tarif dapat berbeda berdasarkan kategori pelanggan, hari penyewaan, dan paket yang dipilih.

### 5.8 Section Informasi Cabang

**Tujuan:** memudahkan pengunjung mengetahui lokasi penyewaan sepeda.

Tampilkan informasi setiap cabang dalam bentuk card.

Informasi yang dapat ditampilkan:

- Nama cabang.
- Alamat lengkap.
- Jam operasional, jika sudah ditentukan.
- Nomor kontak, jika tersedia.
- Petunjuk lokasi atau tautan peta, jika tersedia.

Cabang yang telah diketahui:

- Cabang Perjuangan.
- Cabang kedua, dengan nama dan alamat yang mengikuti data resmi usaha.

Jangan mengarang alamat, nomor telepon, jam operasional, atau tautan peta.

Setiap card dapat menyediakan tombol `Lihat Lokasi` jika tautan peta resmi sudah tersedia.

### 5.9 Section Cara Menyewa

**Tujuan:** menjelaskan proses penyewaan langsung di lokasi kepada pengunjung.

Tampilkan langkah-langkah dalam bentuk tiga atau empat tahapan visual.

1. **Pilih Sepeda** — lihat katalog dan tentukan jenis sepeda yang diinginkan.
2. **Datang ke Cabang** — kunjungi lokasi penyewaan untuk memeriksa unit yang tersedia.
3. **Proses Penyewaan** — petugas mencatat data pelanggan, unit, durasi, dan jaminan sesuai ketentuan.
4. **Mulai Bersepeda** — gunakan sepeda setelah proses penyewaan selesai.

Jika fitur pemindaian QR digunakan untuk membantu proses durasi sewa, jelaskan fungsinya sesuai implementasi aktual. Jangan menyatakan bahwa pemindaian otomatis membuat transaksi atau mengonfirmasi pembayaran jika sistem tidak melakukan hal tersebut.

### 5.10 Section Ketentuan Penyewaan

Tampilkan ringkasan ketentuan dengan bahasa sederhana:

- Kategori pelanggan dan tarif yang berlaku.
- Ketentuan jaminan penyewaan.
- Ketentuan pengembalian sepeda.
- Penanganan keterlambatan.
- Ketentuan kerusakan sepeda.
- Informasi pembayaran tunai dan QRIS.

Sediakan tautan `Lihat Ketentuan Lengkap` apabila halaman atau dokumen ketentuan lengkap tersedia.

Jangan menampilkan ketentuan yang belum ditetapkan sebagai kebijakan resmi.

### 5.11 Footer

Footer menjadi bagian penutup Home dan memuat:

- Nama usaha Jamal Jepret.
- Ringkasan singkat layanan.
- Informasi cabang yang relevan.
- Kontak resmi jika tersedia.
- Informasi hak cipta.

Footer merupakan bagian dari konten yang dapat digulir dan bukan pengganti bottom navigation.

## 6. Durasi Sewa Page

### 6.1 Tujuan

Halaman Durasi Sewa menyediakan antarmuka pemindaian QR Code dengan tampilan menyerupai QR scanner, tetapi tidak menggunakan kamera secara full screen.

Bottom navigation tetap ditampilkan sehingga pengguna dapat berpindah ke Home atau Login.

### 6.2 Layout

Struktur halaman:

1. Header dengan judul `Durasi Sewa`.
2. Instruksi singkat untuk memindai QR Code.
3. Panel atau card pemindaian QR.
4. Area kamera di dalam panel.
5. Bingkai pemindaian.
6. Informasi bantuan atau status kamera.
7. Bottom navigation.

Gunakan latar netral dengan panel pemindaian berwarna putih. Area kamera ditempatkan di tengah panel, bukan memenuhi seluruh layar.

### 6.3 Scan Panel

Panel pemindaian harus:

- Memiliki ukuran yang proporsional dengan layar.
- Menampilkan pratinjau kamera dalam bingkai yang jelas.
- Menggunakan sudut membulat yang konsisten dengan komponen lainnya.
- Menampilkan indikator pemindaian di dalam area kamera.
- Mempertahankan ruang yang cukup untuk instruksi dan status pemindaian.
- Tidak menutupi bottom navigation.

Area kamera dapat menggunakan rasio mendekati persegi agar QR Code mudah diarahkan ke kamera.

### 6.4 Instruksi Pemindaian

Contoh teks:

**Pindai QR Code Sepeda**

Arahkan kamera ke QR Code pada unit sepeda untuk melanjutkan proses sesuai prosedur penyewaan.

Pastikan QR Code terlihat jelas dan berada di dalam bingkai pemindaian.

Instruksi harus singkat dan mudah dipahami.

### 6.5 Camera Permission State

Tampilan halaman harus menangani kondisi izin kamera berikut.

**Belum meminta izin**

Tampilkan pratinjau atau placeholder yang menjelaskan bahwa kamera diperlukan untuk memindai QR Code.

**Izin diberikan**

Aktifkan pratinjau kamera di dalam scan panel.

**Izin ditolak**

Tampilkan penjelasan bahwa akses kamera diperlukan dan sediakan tombol untuk meminta izin kembali atau membuka pengaturan perangkat jika diperlukan.

**Kamera tidak tersedia atau gagal dibuka**

Tampilkan pesan kesalahan yang jelas dan pilihan untuk mencoba kembali.

### 6.6 Scanning State

Saat pemindaian aktif:

- Tampilkan bingkai pemindaian.
- Berikan indikator bahwa kamera sedang mencari QR Code.
- Hindari animasi berlebihan.
- Pertahankan bottom navigation.
- Jangan membuat transaksi baru sebelum kode berhasil dibaca dan divalidasi oleh sistem.

### 6.7 Scan Result State

Jika QR Code berhasil dipindai:

1. Hentikan pemindaian sementara agar hasil tidak diproses berulang kali.
2. Validasi QR Code dengan sistem.
3. Tampilkan hasil yang sesuai dengan jenis kode dan hak akses pengguna.
4. Berikan petunjuk untuk melanjutkan jika autentikasi atau tindakan lain diperlukan.
5. Aktifkan kembali pemindaian apabila hasil tidak valid dan pengguna ingin mencoba lagi.

Pesan yang mungkin ditampilkan:

- QR Code berhasil dibaca.
- QR Code tidak valid.
- QR Code tidak dikenali.
- Unit tidak dapat digunakan.
- Koneksi bermasalah, silakan coba kembali.

Pesan tersebut harus disesuaikan dengan kondisi yang benar-benar dikembalikan oleh sistem.

### 6.8 Business Rule for QR Scanning

- Pemindaian QR tidak boleh dianggap otomatis sebagai transaksi penyewaan yang berhasil.
- QR Code harus divalidasi oleh sistem sebelum tindakan berikutnya dilakukan.
- Status unit harus diperiksa kembali jika pemindaian memicu proses penyewaan.
- Unit yang sedang disewa, dalam perbaikan, atau tidak aktif tidak boleh dialokasikan untuk transaksi baru.
- Jika proses memerlukan akun, arahkan pengguna ke Login dengan tetap mempertahankan konteks yang aman.
- Data QR Code tidak boleh langsung dipercaya tanpa validasi.
- Detail durasi dan biaya harus mengikuti tarif serta aturan bisnis yang berlaku.

### 6.9 Bottom Navigation Behavior

Bottom navigation tetap terlihat di halaman Durasi Sewa.

- `Home` mengarahkan ke halaman Home.
- `Durasi Sewa` menjadi menu aktif selama halaman pemindaian dibuka.
- `Login` mengarahkan ke halaman autentikasi.

Kamera harus dihentikan atau dilepas ketika pengguna meninggalkan halaman pemindaian, aplikasi masuk ke kondisi yang tidak memerlukan kamera, atau proses pemindaian selesai sesuai lifecycle platform.

## 7. Login Page

### 7.1 Tujuan

Halaman Login memungkinkan pengguna yang sudah memiliki akun untuk masuk ke aplikasi.

Halaman ini dibuka melalui menu Login pada bottom navigation.

### 7.2 Layout

Komponen:

1. Logo atau nama Jamal Jepret.
2. Judul `Masuk ke Akun`.
3. Deskripsi singkat.
4. Input email.
5. Input password.
6. Tombol tampilkan atau sembunyikan password.
7. Tombol `Masuk`.
8. Tautan `Belum punya akun? Daftar`.
9. Bottom navigation.

Gunakan layout satu kolom dengan ruang kosong yang memadai.

### 7.3 Form Login

Input:

- Email.
- Password.

Ketentuan desain:

- Setiap input memiliki label.
- Email menggunakan keyboard yang sesuai.
- Password disembunyikan secara default.
- Tombol masuk menampilkan indikator loading ketika permintaan sedang diproses.
- Tombol masuk dinonaktifkan selama proses untuk mengurangi pengiriman berulang.
- Pesan kesalahan ditampilkan secara jelas tanpa membocorkan informasi sensitif.

Contoh validasi:

- Email wajib diisi.
- Format email harus valid.
- Password wajib diisi.
- Kredensial tidak valid.
- Koneksi gagal.

Pesan kesalahan autentikasi harus bersifat umum apabila pembedaan antara email terdaftar dan tidak terdaftar dapat menimbulkan risiko keamanan.

### 7.4 Registration Link

Di bawah tombol Login, tampilkan:

`Belum punya akun? Daftar`

Ketika `Daftar` dipilih, pengguna diarahkan ke halaman Registrasi.

### 7.5 Login Success

Setelah autentikasi berhasil:

- Arahkan pengguna sesuai peran dan hak akses.
- Jangan menampilkan dashboard petugas kepada pelanggan yang tidak memiliki izin.
- Pertahankan informasi transaksi atau konteks QR yang diperlukan hanya jika aman dan didukung sistem.

## 8. Registration Page

### 8.1 Tujuan

Halaman Registrasi memungkinkan pengguna baru membuat akun.

Halaman ini dibuka melalui tautan pada halaman Login.

### 8.2 Layout

Komponen:

- Logo atau nama usaha.
- Judul `Buat Akun`.
- Form registrasi.
- Tombol `Daftar`.
- Tautan `Sudah punya akun? Masuk`.
- Bottom navigation yang konsisten dengan halaman publik.

### 8.3 Form Fields

Field yang ditampilkan mengikuti kebutuhan autentikasi yang ditetapkan dalam PRD.

Sebagai rancangan awal:

- Nama lengkap.
- Email.
- Password.
- Konfirmasi password jika diwajibkan oleh sistem.

Jangan menambahkan input atau persyaratan yang belum ditetapkan tanpa mengonfirmasikannya dengan kebutuhan bisnis.

### 8.4 Validation

- Field wajib harus diisi.
- Format email harus valid.
- Password harus memenuhi aturan keamanan yang berlaku.
- Konfirmasi password harus sama dengan password apabila field tersebut digunakan.
- Email yang sudah digunakan harus menghasilkan pesan yang jelas.
- Tombol Daftar menampilkan loading selama permintaan diproses.

Setelah registrasi berhasil, arahkan pengguna ke alur yang ditetapkan sistem, misalnya Login atau halaman berikutnya sesuai kebijakan autentikasi.

## 9. Staff and Admin Interface

Antarmuka operasional dipisahkan secara logis dari navigasi publik.

Pengguna yang telah login dan memiliki peran petugas atau administrator dapat mengakses halaman operasional sesuai hak aksesnya.

### 9.1 Staff Dashboard

Informasi utama:

- Jumlah unit tersedia.
- Jumlah unit sedang disewa.
- Jumlah unit dalam perbaikan.
- Penyewaan aktif.
- Pengembalian yang perlu ditindaklanjuti.
- Akses cepat untuk transaksi penyewaan dan pengembalian.

### 9.2 Inventaris Sepeda

Data yang ditampilkan:

- Kode unit.
- Jenis sepeda.
- Cabang.
- Status unit.
- Kondisi unit.

Status yang digunakan:

- Tersedia.
- Disewa.
- Perbaikan.
- Tidak Aktif.

Unit yang sedang diperbaiki tidak dapat dipilih dalam transaksi baru.

### 9.3 Transaksi Penyewaan

Formulir harus mendukung pencatatan:

- Pelanggan.
- Unit sepeda.
- Cabang.
- Waktu mulai.
- Durasi atau paket.
- Tarif.
- Jaminan sesuai kebijakan usaha.

Sebelum disimpan, tampilkan ringkasan transaksi untuk diperiksa petugas.

### 9.4 Pengembalian

Tampilkan:

- Informasi transaksi.
- Waktu mulai.
- Waktu pengembalian aktual.
- Status keterlambatan.
- Kondisi sepeda.
- Biaya tambahan apabila berlaku.
- Status akhir transaksi.

Keterlambatan lebih dari dua jam harus ditandai untuk tindak lanjut petugas sesuai kebijakan usaha.

### 9.5 Pembayaran

Metode pembayaran:

- Tunai.
- QRIS.

Pada tahap awal, QRIS dicatat sebagai metode pembayaran tanpa integrasi payment gateway otomatis.

Antarmuka tidak boleh menganggap pembayaran berhasil sebelum petugas mengonfirmasi sesuai prosedur.

### 9.6 Riwayat Transaksi

Tampilkan informasi:

- Nomor transaksi.
- Pelanggan.
- Unit.
- Cabang.
- Waktu penyewaan.
- Status pengembalian.
- Total biaya.
- Status pembayaran.

Riwayat harus konsisten dengan data transaksi saat transaksi dibuat.

## 10. Reusable Components

### 10.1 Buttons

- Primary Button: tindakan utama.
- Secondary Button: tindakan alternatif.
- Text Button: tautan atau aksi sederhana.
- Destructive Button: tindakan berisiko.

Semua tombol harus memiliki label yang jelas dan kondisi loading serta disabled jika diperlukan.

### 10.2 Cards

Gunakan card untuk:

- Unit sepeda.
- Tarif dan paket.
- Informasi cabang.
- Ringkasan operasional.
- Ringkasan transaksi.

### 10.3 Status Badges

Gunakan badge dengan teks dan warna untuk status unit, pembayaran, dan transaksi.

Contoh:

- Tersedia: hijau.
- Disewa: biru.
- Perbaikan: jingga.
- Tidak Aktif: abu-abu.
- Terlambat: merah.
- Lunas: hijau.

### 10.4 Form Inputs

Komponen formulir harus memiliki label, petunjuk jika diperlukan, dan pesan validasi yang relevan.

### 10.5 Scan Panel

Komponen khusus untuk halaman Durasi Sewa:

- Bingkai kamera.
- Area pratinjau.
- Indikator pemindaian.
- Instruksi.
- Pesan izin kamera.
- Pesan hasil pemindaian.

Komponen ini harus dapat menyesuaikan ukuran layar tanpa menutupi navigasi bawah.

### 10.6 Feedback Components

Sediakan komponen untuk:

- Loading.
- Empty state.
- Error state.
- Success message.
- Dialog konfirmasi.
- Informasi izin kamera.

## 11. Interaction and Feedback

### 11.1 Loading State

Gunakan indikator pemuatan ketika katalog, detail, autentikasi, atau transaksi sedang diproses.

### 11.2 Empty State

Contoh:

- Belum ada unit yang tersedia.
- Tidak ada paket yang dapat ditampilkan.
- Tidak ada hasil pencarian.

Jelaskan kondisi dan sediakan langkah berikutnya jika relevan.

### 11.3 Error State

Pesan kesalahan harus menggunakan bahasa yang mudah dipahami. Hindari menampilkan detail teknis internal.

### 11.4 Success State

Tampilkan pesan keberhasilan hanya setelah sistem mengonfirmasi bahwa operasi selesai.

### 11.5 Network State

Katalog, status unit, dan proses transaksi memerlukan data sistem yang valid. Jika koneksi gagal, tampilkan pesan yang sesuai dan jangan menyajikan status lama sebagai informasi terkini tanpa penanda.

## 12. Accessibility and Responsive Layout

- Gunakan ukuran teks yang nyaman dibaca.
- Gunakan target sentuh yang memadai.
- Pastikan kontras teks dan latar cukup.
- Sertakan label teks pada ikon navigasi.
- Jangan mengandalkan warna sebagai satu-satunya penanda.
- Pastikan konten tidak tertutup bottom navigation.
- Pastikan keyboard tidak menutupi input atau tombol formulir.
- Gunakan scrolling untuk konten panjang.
- Pertahankan layout yang proporsional pada ukuran layar berbeda.
- Pastikan area kamera tidak meregang secara tidak wajar.
- Hentikan kamera ketika halaman pemindaian tidak lagi aktif.

## 13. Design Tokens Summary

```text
Primary:             #2E7D32
Primary Dark:        #1B5E20
Primary Light:       #E8F5E9
Secondary:           #F9A825
Background:          #F7F8FA
Surface:             #FFFFFF
Text Primary:        #212121
Text Secondary:      #616161
Border:              #E0E0E0
Success:             #2E7D32
Warning:             #EF6C00
Error:               #C62828
Info:                #1565C0

Font Family:         Inter
Base Font Size:      14 sp
Body Large:          16 sp
Page Padding:        16 dp
Card Radius:         12 dp
Button Radius:       10-12 dp
Input Radius:        8-10 dp
Spacing Base:        4 dp

Public Navigation:
- Home: home
- Durasi Sewa: scan-line
- Login: user-round
```

## 14. Business Rules

1. Pengunjung dapat mengakses Home, katalog, tarif, paket, dan informasi cabang tanpa login.
2. Penyewaan dilakukan langsung di lokasi, bukan melalui pemesanan mandiri dari aplikasi.
3. Halaman Durasi Sewa menggunakan antarmuka pemindaian QR Code yang tidak memenuhi seluruh layar.
4. Bottom navigation tetap tersedia pada halaman publik.
5. QR Code harus divalidasi sebelum digunakan untuk tindakan operasional.
6. Status unit harus diperiksa sebelum unit dialokasikan dalam transaksi baru.
7. Unit berstatus perbaikan tidak boleh disewakan.
8. Tarif ditentukan berdasarkan kategori pelanggan, kondisi hari, dan paket yang berlaku.
9. Kerusakan ringan tidak dikenai penalti berdasarkan kebijakan yang telah ditetapkan.
10. Kerusakan berat dapat dikenai biaya ganti rugi sesuai kebijakan usaha.
11. Keterlambatan lebih dari dua jam memerlukan tindak lanjut petugas.
12. Pembayaran yang dicatat adalah tunai dan QRIS.
13. QRIS belum menggunakan verifikasi otomatis melalui payment gateway pada tahap awal.
14. Hak akses fitur operasional ditentukan berdasarkan peran pengguna.
15. Data transaksi historis tetap konsisten dengan tarif yang berlaku saat transaksi dibuat.

## 15. Implementation Guidelines

- Gunakan komponen UI yang dapat digunakan kembali.
- Simpan warna, tipografi, spacing, dan radius dalam konfigurasi theme.
- Pisahkan logika autentikasi, pemindaian, dan transaksi dari komponen visual.
- Jangan menanam tarif, jumlah unit, atau status ketersediaan sebagai nilai statis.
- Validasi aturan bisnis pada backend, bukan hanya pada UI.
- Terapkan lifecycle kamera sesuai platform.
- Pastikan halaman pemindaian tidak menghalangi navigasi utama.
- Uji seluruh halaman dengan loading, error, dan empty state.
- Uji alur navigasi publik sebelum menguji alur operasional.
- Sesuaikan desain dengan PRD apabila terdapat perbedaan aturan bisnis.

## 16. Definition of Done

Desain dianggap siap diimplementasikan apabila:

- Home memiliki seluruh section yang telah ditentukan.
- Katalog unit ditampilkan dalam card yang konsisten.
- Tarif dan paket ditampilkan berdasarkan data yang berlaku.
- Informasi cabang menggunakan data resmi.
- Halaman Durasi Sewa menampilkan kamera dalam panel, bukan full screen.
- Bottom navigation tetap tersedia pada ketiga halaman publik.
- Login menyediakan tautan ke Registrasi.
- Registrasi menyediakan tautan kembali ke Login.
- Status pemindaian dan izin kamera ditangani dengan benar.
- Status unit dan transaksi ditampilkan secara jelas.
- Layout dapat digunakan pada ukuran layar yang didukung.
- Tidak ada alur pemesanan mandiri yang bertentangan dengan proses walk-in.
- Tampilan tidak menyatakan operasi berhasil sebelum sistem mengonfirmasinya.

---

**End of Design System**
