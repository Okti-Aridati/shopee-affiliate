# 🛍️ Shopee Affiliate Products

Website statis untuk menampilkan semua produk afiliasi Shopee dalam 1 halaman.

## Fitur
- 🔍 **Search** — cari produk by nama atau toko
- 💰 **Filter harga** — < Rp50RB, Rp50-200RB, Rp200-500RB, > Rp500RB
- 🏪 **Filter toko** — filter per store
- 📊 **Sort** — harga, penjualan, komisi, A-Z
- 📋 **Copy link** — salin link afiliasi 1 klik
- 🛒 **Buy link** — langsung ke Shopee

## Deploy ke Vercel

```bash
# 1. Push ke GitHub
git init
git add .
git commit -m "init: shopee affiliate site"
git remote add origin <your-repo-url>
git push -u origin main

# 2. Import ke Vercel
# https://vercel.com/import
# Pilih repo → Build command: node scripts/build-data.js
# Output dir: public
```

## Update Data
Edit `affiliate_database.json` lalu jalankan:
```bash
node scripts/build-data.js
```