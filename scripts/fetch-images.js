#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const BOT_UA = 'TelegramBot (like TwitterBot)';
const PRODUCTS = path.join(__dirname, '..', 'public', 'data', 'products.json');
const OUT = path.join(__dirname, '..', 'images_cache.json');
const CONCURRENCY = 12;
const RETRIES = 3;

function fetchOgImage(url) {
  return new Promise((resolve) => {
    const tryFetch = (u, attempt) => {
      const lib = u.startsWith('https') ? https : http;
      const req = lib.get(u, {
        headers: { 'User-Agent': BOT_UA, 'Accept': 'text/html' },
        timeout: 15000,
      }, (res) => {
        // Don't follow redirects — og:image is on the short-link page itself
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          // some short links need one redirect to the opaanlp page which ALSO has og:image
          if (attempt < 1) {
            res.resume();
            return tryFetch(res.headers.location, attempt + 1);
          }
        }
        let data = '';
        res.setEncoding('utf8');
        res.on('data', (c) => (data += c));
        res.on('end', () => {
          const m = data.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i)
                  || data.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i);
          resolve(m ? m[1] : null);
        });
      });
      req.on('timeout', () => { req.destroy(); resolve(null); });
      req.on('error', () => resolve(null));
    };
    tryFetch(url, 0);
  });
}

async function main() {
  const products = JSON.parse(fs.readFileSync(PRODUCTS, 'utf-8'));
  let cache = {};
  if (fs.existsSync(OUT)) {
    cache = JSON.parse(fs.readFileSync(OUT, 'utf-8'));
  }

  const todo = products.filter(p => !cache[p.id]);
  console.log(`Crawling ${todo.length} products (${Object.keys(cache).length} cached)...`);

  let done = 0;
  let ok = 0;

  async function worker() {
    while (todo.length) {
      const p = todo.shift();
      let img = null;
      for (let r = 0; r < RETRIES && !img; r++) {
        img = await fetchOgImage(p.link);
      }
      if (img) { cache[p.id] = img; ok++; }
      done++;
      if (done % 25 === 0) {
        fs.writeFileSync(OUT, JSON.stringify(cache));
        console.log(`  ${done}/${products.length} (${ok} images)`);
      }
    }
  }

  const workers = Array.from({ length: CONCURRENCY }, worker);
  await Promise.all(workers);
  fs.writeFileSync(OUT, JSON.stringify(cache));
  console.log(`✅ Done: ${ok}/${products.length} images fetched, ${Object.keys(cache).length} total cached`);
}

main();
