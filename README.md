# ETALASE — Koleksi Pilihan

Website storefront statis yang menampilkan produk dalam satu etalase rapi. Bisa menampung ratusan produk dengan tampilan elegan, mode gelap (default), dan navigasi per kategori.

## Fitur
- 🌗 **Dark mode (default)** + toggle terang/gelap, tersimpan di `localStorage`
- 🔍 **Search** — cari produk by nama atau toko (live, debounced)
- 🏷️ **Filter kategori** — Tas & Bag, Dompet, Aksesoris, Kosmetik & Beauty, Fashion, Rumah & Lainnya, Lainnya (dengan jumlah per kategori)
- 📊 **Sort** — terbaru, harga naik/turun, paling laku, A–Z
- 📄 **Pagination** — 24 produk/halaman, navigasi windowed + info halaman
- 🖼️ **Gambar produk asli** — diambil dari preview Shopee (OG image), load langsung dari CDN
- ⬆️ **Back to top** — tombol mengambang saat scroll
- 📋 **Bagikan** — salin link produk 1 klik + **Beli** langsung ke toko
- 📱 **Responsif** — mobile sampai desktop, menghormati `prefers-reduced-motion`

## Struktur
```
shopee-affiliate/
├── public/
│   ├── index.html          ← aplikasi (HTML/CSS/JS, tanpa framework)
│   └── data/
│       └── products.json   ← data produk (di-generate)
├── scripts/
│   ├── build-data.js        ← transform affiliate_database.json → products.json
│   └── fetch-images.js      ← crawl OG image per produk → images_cache.json
├── affiliate_database.json  ← sumber data mentah
├── images_cache.json        ← cache URL gambar (id → og:image)
├── vercel.json
└── package.json
```

## Deploy ke Vercel
1. Push repo ke GitHub.
2. Buka https://vercel.com/import → pilih repo.
3. **Build Command:** `node scripts/build-data.js`
4. **Output Directory:** `public`
5. Deploy.

## Update Data
Edit `affiliate_database.json`, lalu:
```bash
node scripts/build-data.js          # regenerate products.json
# opsional: refresh gambar
node scripts/fetch-images.js        # crawl ulang OG image (butuh jaringan)
```
Commit & push → Vercel auto-redeploy.

## Lokal
```bash
npm run build      # generate data
npm run dev        # serve di http://localhost:3000
# atau:
cd public && python3 -m http.server 3999
```
