#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Read the source affiliate database
const source = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, '..', '..', '.hermes', 'cache', 'documents', 'doc_a0e033d63377_affiliate_database.json'),
    'utf-8'
  )
);

// Transform to clean format
const products = source.products.map(p => ({
  id: p.id,
  name: p.name,
  price: p.price,
  sales: p.sales,
  store: p.store,
  commission: p.commission,
  link: p.full_link
}));

// Write to public/data/
const outDir = path.join(__dirname, '..', 'public', 'data');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'products.json'), JSON.stringify(products));

console.log(`✅ Exported ${products.length} products to public/data/products.json`);