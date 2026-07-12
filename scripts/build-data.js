#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Read the source affiliate database from repo root
const dbPath = path.join(__dirname, '..', 'affiliate_database.json');
const source = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

// Transform to clean format
const products = source.products.map(p => ({
  id: p.id,
  name: p.name,
  price: p.price,
  sales: p.sales,
  store: p.store.replace(/\u00a0/g, ' ').trim(),
  commission: p.commission,
  link: p.full_link
}));

// Write to public/data/
const outDir = path.join(__dirname, '..', 'public', 'data');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'products.json'), JSON.stringify(products));

console.log(`✅ Exported ${products.length} products to public/data/products.json`);