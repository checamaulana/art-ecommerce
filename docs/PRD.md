# Product Requirements Document (PRD)
## E-Commerce Lukisan / Art Gallery Online Catalog

**Version:** 1.1  
**Last Updated:** 2026-02-09  
**Author:** Developer  
**Status:** Development Phase  
**Architecture:** Laravel + Inertia.js + React (Monolith)

---

## 1. Executive Summary

### 1.1 Product Overview
Sebuah platform e-commerce berbasis online catalog untuk seniman/pelukis yang ingin menjual karya lukisannya. Platform ini berfungsi sebagai gallery showcase yang menampilkan katalog lukisan, dimana transaksi final dilakukan melalui WhatsApp.

### 1.2 Business Model
- **Tipe:** Online Catalog + WhatsApp Transaction
- **Seller Model:** Single Seller (satu artist)
- **Revenue Model:** Direct sales dari artist ke pembeli

### 1.3 Problem Statement
Klien (artist) saat ini menjual lukisan melalui Instagram dan WhatsApp secara manual. Tidak ada platform terpusat untuk menampilkan portfolio dan katalog dengan informasi lengkap (harga, ukuran, deskripsi, status ketersediaan).

### 1.4 Solution
Website e-commerce yang berfungsi sebagai:
1. Gallery online untuk showcase karya
2. Katalog produk dengan informasi lengkap
3. Sistem manajemen produk untuk artist
4. Jembatan komunikasi ke WhatsApp untuk transaksi

---

## 2. Target Users

### 2.1 Primary Users (Buyers)
| Segment | Description |
|---------|-------------|
| **Art Enthusiasts** | Siapapun yang tertarik pada karya seni |
| **Home Decorators** | Pembeli untuk dekorasi rumah/apartemen |
| **Collectors** | Kolektor lukisan (original) |
| **Businesses** | Kafe, kantor, hotel yang butuh artwork |
| **Gift Buyers** | Pembeli lukisan sebagai hadiah |

### 2.2 Geographic Target
- **Primary:** Indonesia (Bahasa Indonesia, IDR)
- **Secondary:** International (English, USD)

### 2.3 Admin User
- **Artist/Owner:** Mengelola produk, kategori, dan melihat data user

---

## 3. Product Types

### 3.1 Product Categories
| Type | Description |
|------|-------------|
| **Original** | Lukisan asli satu-satunya (unique piece) |
| **Print** | Reproduksi cetak di berbagai media (canvas, paper) dengan berbagai ukuran |
| **Digital** | File digital yang bisa didownload setelah transaksi |

### 3.2 Art Styles/Themes
Kategori tema dinamis dan dikelola melalui admin panel. Contoh kategori:
- Abstract
- Nature/Landscape
- Portrait
- Still Life
- Modern
- Traditional
- Dan lain-lain (ditentukan oleh artist)

### 3.3 Product Information Schema
Setiap produk WAJIB memiliki informasi berikut:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | String | ✅ | Judul lukisan |
| `slug` | String | ✅ | URL-friendly identifier (auto-generated) |
| `description` | Text | ✅ | Deskripsi/cerita di balik lukisan |
| `price` | Decimal | ✅ | Harga dalam IDR |
| `price_usd` | Decimal | ❌ | Harga dalam USD (opsional, bisa auto-convert) |
| `width` | Integer | ✅ | Lebar dalam cm |
| `height` | Integer | ✅ | Tinggi dalam cm |
| `medium` | String | ✅ | Teknik/medium (cat minyak, akrilik, watercolor, dll) |
| `year_created` | Integer | ✅ | Tahun pembuatan |
| `status` | Enum | ✅ | available, sold |
| `product_type` | Enum | ✅ | original, print, digital |
| `category_id` | FK | ✅ | Referensi ke kategori |
| `images` | Array | ✅ | Minimal 1 gambar, bisa multiple |
| `is_featured` | Boolean | ❌ | Untuk highlight di homepage |
| `created_at` | Timestamp | ✅ | Auto-generated |
| `updated_at` | Timestamp | ✅ | Auto-generated |

### 3.4 Print Size Variants
Untuk produk bertipe `print`, diperlukan sistem varian ukuran:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `product_id` | FK | ✅ | Referensi ke produk |
| `size_name` | String | ✅ | Nama ukuran (A4, A3, A2, Custom, dll) |
| `width` | Integer | ✅ | Lebar dalam cm |
| `height` | Integer | ✅ | Tinggi dalam cm |
| `price` | Decimal | ✅ | Harga untuk ukuran ini |
| `price_usd` | Decimal | ❌ | Harga USD |

---

## 4. Functional Requirements

### 4.1 Public Website (User-Facing)

#### 4.1.1 Homepage
| Feature | Priority | Description |
|---------|----------|-------------|
| Hero Section | P0 | Banner utama dengan tagline |
| Featured Products | P0 | Grid lukisan unggulan |
| Category Showcase | P1 | Preview kategori |
| Call-to-Action | P0 | Link ke catalog |

#### 4.1.2 Catalog Page
| Feature | Priority | Description |
|---------|----------|-------------|
| Product Grid | P0 | Grid responsif menampilkan semua produk |
| Sort | P0 | Newest, Price Low-High, Price High-Low |
| Filter: Category | P0 | Filter berdasarkan kategori |
| Filter: Price Range | P0 | Filter berdasarkan rentang harga |
| Filter: Product Type | P0 | Filter: Original, Print, Digital |
| Filter: Status | P1 | Filter: Available, Sold |
| Filter: Size | P1 | Filter berdasarkan ukuran |
| Pagination | P0 | Load more atau numbered pages |
| Search | P1 | Pencarian berdasarkan judul/deskripsi |

#### 4.1.3 Product Detail Page
| Feature | Priority | Description |
|---------|----------|-------------|
| Image Gallery | P0 | Multiple foto dengan zoom capability |
| Product Info | P0 | Semua informasi produk |
| Size Selector | P0 | Untuk print: pilih ukuran & lihat harga |
| Status Badge | P0 | Available / SOLD badge |
| WhatsApp Button | P0 | Tombol chat dengan pesan otomatis |
| Related Products | P2 | Produk serupa (kategori sama) |
| Share Buttons | P2 | Share ke social media |

#### 4.1.4 WhatsApp Integration
Ketika user klik tombol WhatsApp:
```
Target: wa.me/{PHONE_NUMBER}
Message Template (ID): 
"Halo, saya tertarik dengan lukisan "{PRODUCT_TITLE}"
Link: {PRODUCT_URL}"

Message Template (EN):
"Hello, I'm interested in the painting "{PRODUCT_TITLE}"
Link: {PRODUCT_URL}"
```

#### 4.1.5 Static Pages
| Page | Content |
|------|---------|
| Contact | WhatsApp link, Instagram link, Email |
| FAQ | Pertanyaan umum tentang pembelian, pengiriman, dll |
| Terms & Conditions | Syarat dan ketentuan |
| Privacy Policy | Kebijakan privasi |

#### 4.1.6 Authentication
| Feature | Priority | Description |
|---------|----------|-------------|
| Register | P0 | Email + Password |
| Login | P0 | Email + Password |
| Forgot Password | P1 | Reset via email |
| Logout | P0 | Session termination |

#### 4.1.7 User Account Features
| Feature | Priority | Description |
|---------|----------|-------------|
| Profile | P0 | Nama, email, nomor WA, alamat |
| Wishlist | P1 | Simpan lukisan favorit |
| View History | P2 | Riwayat produk yang pernah dilihat |

### 4.2 Admin Panel

#### 4.2.1 Dashboard
| Feature | Priority | Description |
|---------|----------|-------------|
| Statistics | P1 | Total produk, total user, produk terjual |
| Quick Actions | P1 | Shortcut ke fitur utama |

#### 4.2.2 Product Management
| Feature | Priority | Description |
|---------|----------|-------------|
| List Products | P0 | Tabel semua produk dengan search & filter |
| Add Product | P0 | Form tambah produk baru |
| Edit Product | P0 | Form edit produk existing |
| Delete Product | P0 | Hapus produk (soft delete) |
| Upload Images | P0 | Multiple image upload dengan drag & drop |
| Manage Variants | P0 | Untuk print: kelola ukuran & harga |
| Toggle Status | P0 | Quick toggle available/sold |
| Toggle Featured | P1 | Quick toggle featured |

#### 4.2.3 Category Management
| Feature | Priority | Description |
|---------|----------|-------------|
| List Categories | P0 | Daftar semua kategori |
| Add Category | P0 | Tambah kategori baru |
| Edit Category | P0 | Edit nama kategori |
| Delete Category | P0 | Hapus kategori (jika tidak ada produk) |

#### 4.2.4 Print Size Management
| Feature | Priority | Description |
|---------|----------|-------------|
| List Sizes | P0 | Daftar ukuran print default |
| Add Size | P0 | Tambah ukuran baru |
| Edit Size | P0 | Edit ukuran & harga default |
| Delete Size | P0 | Hapus ukuran |

#### 4.2.5 User Management
| Feature | Priority | Description |
|---------|----------|-------------|
| List Users | P1 | Daftar user terdaftar (read-only) |
| View User Detail | P2 | Lihat detail user |
| Export Users | P2 | Export ke CSV |

---

## 5. Non-Functional Requirements

### 5.1 Localization
| Aspect | Requirement |
|--------|-------------|
| Languages | Indonesian (default), English |
| Currencies | IDR (default), USD |
| Switching | Manual toggle by user |
| Persistence | Save preference in localStorage/cookie |

### 5.2 Performance
| Metric | Target |
|--------|--------|
| Page Load Time | < 3 seconds |
| Time to Interactive | < 5 seconds |
| Image Optimization | Lazy loading, WebP format |
| API Response Time | < 500ms |

### 5.3 Security
| Aspect | Requirement |
|--------|-------------|
| Authentication | Laravel session-based (Inertia) |
| Password | Hashed with bcrypt |
| CSRF | Laravel CSRF protection |
| Rate Limiting | Laravel throttle middleware |
| Input Validation | Form Requests (server-side) |
| SQL Injection | Protected via Eloquent ORM |
| XSS | Sanitized output |

### 5.4 SEO
| Aspect | Requirement |
|--------|-------------|
| Meta Tags | Dynamic per page |
| Open Graph | For social sharing |
| Sitemap | Auto-generated |
| Robots.txt | Configured |
| Semantic HTML | Proper heading hierarchy |
| Alt Text | Required for images |

### 5.5 Responsive Design
| Breakpoint | Target |
|------------|--------|
| Mobile | 320px - 767px |
| Tablet | 768px - 1023px |
| Desktop | 1024px+ |

---

## 6. Out of Scope (v1.0)

Fitur-fitur berikut TIDAK termasuk dalam versi 1.0:

| Feature | Reason |
|---------|--------|
| Direct Checkout/Payment | Transaksi via WhatsApp |
| Shopping Cart | Tidak ada checkout |
| Order Management | Dikelola manual via WhatsApp |
| Shipping Integration | Diatur manual |
| Reviews/Ratings | Belum prioritas |
| Blog/News | Tidak diperlukan |
| About Artist Page | Tidak diperlukan |
| Instagram Feed Integration | Tidak diperlukan |
| Room Mockup Preview | Tidak diperlukan |
| Social Login (Google/FB) | Hanya email+password |
| Multi-seller/Marketplace | Single seller only |

---

## 7. Success Metrics

| Metric | Target |
|--------|--------|
| Website Live | Deployed and accessible |
| Product Upload | All 30 initial products uploaded |
| Admin Usability | Artist can manage products independently |
| Mobile Friendly | 100% responsive |
| WhatsApp Integration | Working correctly |

---

## 8. Assumptions & Dependencies

### 8.1 Assumptions
1. Artist memiliki nomor WhatsApp aktif untuk transaksi
2. Artist akan menyediakan foto-foto lukisan berkualitas tinggi
3. Artist akan menentukan kategori dan ukuran print yang diinginkan
4. Transaksi dan pengiriman dikelola sepenuhnya di luar sistem

### 8.2 Dependencies
1. WhatsApp API (wa.me link, tidak butuh Business API)
2. Image hosting/storage solution
3. Domain dan hosting (TBD)

---

## 9. Timeline

| Phase | Description | Status |
|-------|-------------|--------|
| Planning | Requirements gathering | ✅ Complete |
| Design | UI/UX mockups | 🔲 Not Started |
| Development | Frontend + Backend | 🔲 Not Started |
| Testing | QA & UAT | 🔲 Not Started |
| Deployment | Go Live | 🔲 Not Started |

**Deadline:** Tidak ada deadline spesifik

---

## 10. Appendix

### 10.1 Glossary
| Term | Definition |
|------|------------|
| Original | Lukisan asli satu-satunya |
| Print | Reproduksi cetak lukisan |
| Digital | File digital lukisan |
| Catalog | Daftar produk yang bisa di-browse |
| Wishlist | Daftar produk favorit user |

### 10.2 References
- Initial Product Count: ~30 lukisan
