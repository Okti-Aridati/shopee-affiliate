#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Read the source affiliate database from repo root
const dbPath = path.join(__dirname, '..', 'affiliate_database.json');
const source = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

// Image cache from crawler (id -> og:image url)
const imgCachePath = path.join(__dirname, '..', 'images_cache.json');
const imgCache = fs.existsSync(imgCachePath) ? JSON.parse(fs.readFileSync(imgCachePath, 'utf-8')) : {};

// Category inference from product name
function categorize(name) {
  const n = name.toLowerCase();
  if (/(dompet|wallet|pouch|koin)/.test(n)) return 'Dompet';
  if (/(gantungan|keychain|aksesoris|aksesori|charm|lonceng|kait|gelang|kalung|cincin|bro*s|pin)/.test(n)) return 'Aksesoris';
  if (/(kosmetik|parfum|makeup|serum|cream|lips|lipstik|skincare|beauty|bulu mata|maskara|foundation|bedak|blush|eyelash|skincare|cleansing|toner)/.test(n)) return 'Kosmetik & Beauty';
  if (/(baju|dress|hijab|celana|kaos|kemeja|rok|daster|pajama|blouse|outfit|t-shirt|klambi|fashion|jaket|cardigan|vest|jilbab|kerudung)/.test(n)) return 'Fashion';
  if (/(botol|tumbler|gelas|mug|case|sarung|sprei|handa|sepatu|sendal|hak|flat|sandal)/.test(n)) return 'Rumah & Lainnya';
  if (/(tas|bag|tote|slingbag|backpack|ransel|shoulder|handbag|bucket|duffel|sling|selempang|bahuk|jinjing)/.test(n)) return 'Tas & Bag';
  return 'Lainnya';
}

// Transform to clean format
const products = source.products.map(p => {
  const name = p.name;
  return {
    id: p.id,
    name: name,
    price: p.price,
    sales: p.sales,
    store: p.store.replace(/\u00a0/g, ' ').trim(),
    commission: p.commission,
    link: p.full_link,
    image: imgCache[p.id] || null,
    category: categorize(name)
  };
});

// Write to public/data/
const outDir = path.join(__dirname, '..', 'public', 'data');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'products.json'), JSON.stringify(products));

const withImg = products.filter(p => p.image).length;
console.log(`✅ Exported ${products.length} products (${withImg} with images) to public/data/products.json`);