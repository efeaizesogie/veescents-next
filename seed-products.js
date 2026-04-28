const mongoose = require('mongoose');
const https = require('https');
const fs = require('fs');
const path = require('path');

const MONGODB_URI = 'mongodb://efeaizesogie_db_user:0gmN9TkxOPXz80mZ@ac-a86hpii-shard-00-00.kbhuqpa.mongodb.net:27017,ac-a86hpii-shard-00-01.kbhuqpa.mongodb.net:27017,ac-a86hpii-shard-00-02.kbhuqpa.mongodb.net:27017/?ssl=true&replicaSet=atlas-14ctda-shard-0&authSource=admin&appName=veescent-cluster';
const PUBLIC_DIR = path.join(__dirname, 'public', 'products');

/**
 * CLASSIFICATION GUIDE:
 * collection: matches the slug in the Collections model (original-designer-perfume, arabian-luxury-perfume, arabian-perfume, perfume-oil, body-spray, body-mist, perfume-gift-set, diffuser, kiddies, combo)
 * category: men | women | unisex
 * section: new_collection (shows on homepage new arrivals) | gallery (main store)
 * tags: array for extra filtering (best_seller, recommended, new_arrival, deal)
 * salesCount: used for best sellers sort
 */
const PRODUCTS = [
  // ─── ORIGINAL DESIGNER PERFUMES ───────────────────────────────────────────
  {
    name: 'Armaf Club de Nuit Intense EDT 105ml For Men',
    brand: 'Armaf', price: 59999, rating: 5,
    image: 'https://fragrances.com.ng/media/catalog/product/cache/553761e1c239bcd5973d5ba4fb1f412b/a/r/armaf_club_nuit_intense_edp_100ml_perfume_for_men2.jpg',
    category: 'men', collection: 'original-designer-perfume', section: 'gallery',
    tags: ['best_seller', 'recommended'], salesCount: 210, isNewProduct: false, inStock: true,
  },
  {
    name: 'Franck Olivier Oud Touch EDP 100ml For Men',
    brand: 'Franck Olivier', price: 33999, rating: 5,
    image: 'https://fragrances.com.ng/media/catalog/product/cache/553761e1c239bcd5973d5ba4fb1f412b/f/r/franck_olivier_oud_touch_edp_100ml_for_men-4.jpeg',
    category: 'men', collection: 'original-designer-perfume', section: 'gallery',
    tags: ['best_seller', 'deal'], salesCount: 310, isNewProduct: false, inStock: true,
  },
  {
    name: 'Giorgio Armani Emporio Stronger With You Intensely EDP 100ml',
    brand: 'Giorgio Armani', price: 199999, rating: 5,
    image: 'https://fragrances.com.ng/media/catalog/product/cache/553761e1c239bcd5973d5ba4fb1f412b/g/i/giorgio_armani_emporio_armani_stronger_with_you_intensely_edp_100ml_perfume_for_men.jpg',
    category: 'men', collection: 'original-designer-perfume', section: 'gallery',
    tags: ['best_seller', 'recommended'], salesCount: 20, isNewProduct: false, inStock: true,
  },
  {
    name: 'Gucci Intense Oud EDP 90ml For Men',
    brand: 'Gucci', price: 239999, rating: 5,
    image: 'https://fragrances.com.ng/media/catalog/product/cache/553761e1c239bcd5973d5ba4fb1f412b/g/u/gucci_intense_oud_90ml_perfume.jpg',
    category: 'men', collection: 'original-designer-perfume', section: 'gallery',
    tags: ['best_seller', 'recommended'], salesCount: 20, isNewProduct: false, inStock: true,
  },
  {
    name: 'Mancera Red Tobacco EDP 120ml For Men',
    brand: 'Mancera', price: 159999, rating: 5,
    image: 'https://fragrances.com.ng/media/catalog/product/cache/553761e1c239bcd5973d5ba4fb1f412b/m/a/mancera_red_tobacco_edp_120ml_perfume_for_men_1.jpg',
    category: 'men', collection: 'original-designer-perfume', section: 'gallery',
    tags: ['best_seller', 'recommended'], salesCount: 20, isNewProduct: false, inStock: true,
  },
  {
    name: 'Salvatore Ferragamo Spicy Leather Parfum 100ml',
    brand: 'Salvatore Ferragamo', price: 119999, rating: 5,
    image: 'https://fragrances.com.ng/media/catalog/product/cache/553761e1c239bcd5973d5ba4fb1f412b/s/a/salvatore_ferragamo_spicy_leather_edp_100ml.jpg',
    category: 'men', collection: 'original-designer-perfume', section: 'gallery',
    tags: ['recommended'], salesCount: 0, isNewProduct: false, inStock: true,
  },
  {
    name: 'Azzaro The Most Wanted Parfum 100ml For Men',
    brand: 'Azzaro', price: 169999, rating: 5,
    image: 'https://fragrances.com.ng/media/catalog/product/cache/553761e1c239bcd5973d5ba4fb1f412b/a/z/azzaro_most_wanted.jpeg',
    category: 'men', collection: 'original-designer-perfume', section: 'gallery',
    tags: ['recommended'], salesCount: 0, isNewProduct: false, inStock: true,
  },
  {
    name: 'Joop Homme EDT 125ml For Men',
    brand: 'Joop', price: 59999, rating: 5,
    image: 'https://fragrances.com.ng/media/catalog/product/cache/553761e1c239bcd5973d5ba4fb1f412b/j/o/joop_homme_edt_125ml_perfume_for_men.jpeg',
    category: 'men', collection: 'original-designer-perfume', section: 'gallery',
    tags: ['deal'], salesCount: 0, isNewProduct: false, inStock: true,
  },
  {
    name: 'Carolina Herrera 212 NYC EDT 100ml For Men',
    brand: 'Carolina Herrera', price: 136999, rating: 5,
    image: 'https://fragrances.com.ng/media/catalog/product/cache/553761e1c239bcd5973d5ba4fb1f412b/c/a/carolina_herrera_212_nyc_edt_100ml_for_men_1.jpeg',
    category: 'men', collection: 'original-designer-perfume', section: 'gallery',
    tags: ['best_seller', 'recommended'], salesCount: 20, isNewProduct: false, inStock: true,
  },
  {
    name: 'Geoffrey Beene Grey Flannel EDT 120ml For Men',
    brand: 'Geoffrey Beene', price: 49999, rating: 5,
    image: 'https://fragrances.com.ng/media/catalog/product/cache/553761e1c239bcd5973d5ba4fb1f412b/g/e/geoffrey_beene_grey_flannel_edt_120ml_for_men-3_1.jpg',
    category: 'men', collection: 'original-designer-perfume', section: 'gallery',
    tags: ['deal'], salesCount: 0, isNewProduct: false, inStock: true,
  },
  {
    name: 'Armaf Club de Nuit Urban Man EDP Elixir 105ml',
    brand: 'Armaf', price: 63999, rating: 5,
    image: 'https://fragrances.com.ng/media/catalog/product/cache/553761e1c239bcd5973d5ba4fb1f412b/a/r/armaf_club_de_nuit_urban_man_edp_elixir_100ml.jpeg',
    category: 'men', collection: 'original-designer-perfume', section: 'new_collection',
    tags: ['new_arrival', 'recommended'], salesCount: 0, isNewProduct: true, inStock: true,
  },
  {
    name: 'Armaf Club De Nuit Precieux 1 EDP 55ml',
    brand: 'Armaf', price: 89999, rating: 5,
    image: 'https://fragrances.com.ng/media/catalog/product/cache/553761e1c239bcd5973d5ba4fb1f412b/a/r/armaf_club_de_nuit_precieux_1_edp_105ml.jpeg',
    category: 'men', collection: 'original-designer-perfume', section: 'new_collection',
    tags: ['new_arrival', 'best_seller'], salesCount: 10, isNewProduct: true, inStock: true,
  },

  // ─── ARABIAN LUXURY PERFUMES ───────────────────────────────────────────────
  {
    name: "Afnan Supremacy Collector's Edition EDP 100ml",
    brand: 'Afnan', price: 96999, rating: 5,
    image: 'https://fragrances.com.ng/media/catalog/product/cache/553761e1c239bcd5973d5ba4fb1f412b/a/f/afnan_supremacy_collector_s_edition_edp_100ml.jpeg',
    category: 'unisex', collection: 'arabian-luxury-perfume', section: 'new_collection',
    tags: ['new_arrival', 'recommended'], salesCount: 0, isNewProduct: true, inStock: true,
  },
  {
    name: 'Rasasi Hawas Ice EDP 100ml',
    brand: 'Rasasi', price: 69999, rating: 5,
    image: 'https://fragrances.com.ng/media/catalog/product/cache/553761e1c239bcd5973d5ba4fb1f412b/r/a/rasasi_hawas_ice_edp_100ml.jpg',
    category: 'men', collection: 'arabian-luxury-perfume', section: 'gallery',
    tags: ['best_seller', 'recommended'], salesCount: 0, isNewProduct: false, inStock: true,
  },
  {
    name: 'Afnan 9pm Elixir Parfum Intense 100ml',
    brand: 'Afnan', price: 59999, rating: 5,
    image: 'https://fragrances.com.ng/media/catalog/product/cache/553761e1c239bcd5973d5ba4fb1f412b/a/f/afnan_9pm_elixir_parfum_intense_100ml.jpg',
    category: 'men', collection: 'arabian-luxury-perfume', section: 'new_collection',
    tags: ['new_arrival', 'best_seller'], salesCount: 0, isNewProduct: true, inStock: true,
  },
  {
    name: 'Rayhaan Elixir Eau de Parfum 100ml',
    brand: 'Rayhaan', price: 49999, rating: 5,
    image: 'https://fragrances.com.ng/media/catalog/product/cache/553761e1c239bcd5973d5ba4fb1f412b/r/a/rayhaan_elixir_eau_de_parfum_100ml-3_1.jpeg',
    category: 'unisex', collection: 'arabian-luxury-perfume', section: 'gallery',
    tags: ['recommended'], salesCount: 0, isNewProduct: false, inStock: true,
  },
  {
    name: 'Rayhaan Pacific Aura Pour Homme EDP 100ml',
    brand: 'Rayhaan', price: 39999, rating: 5,
    image: 'https://fragrances.com.ng/media/catalog/product/cache/553761e1c239bcd5973d5ba4fb1f412b/r/a/rayhaan_pacific_aura_pour_homme_edp_100ml_.jpeg',
    category: 'men', collection: 'arabian-luxury-perfume', section: 'gallery',
    tags: ['deal', 'recommended'], salesCount: 0, isNewProduct: false, inStock: true,
  },
  {
    name: 'Rasasi Hawas EDP 100ml For Men',
    brand: 'Rasasi', price: 74999, rating: 5,
    image: 'https://fragrances.com.ng/media/catalog/product/cache/553761e1c239bcd5973d5ba4fb1f412b/r/a/rasasi_hawas_edp_100ml_perfume_for_men.jpg',
    category: 'men', collection: 'arabian-luxury-perfume', section: 'gallery',
    tags: ['best_seller', 'recommended'], salesCount: 40, isNewProduct: false, inStock: true,
  },
  {
    name: 'Afnan Rare Reef EDP 100ml',
    brand: 'Afnan', price: 54999, rating: 5,
    image: 'https://fragrances.com.ng/media/catalog/product/cache/553761e1c239bcd5973d5ba4fb1f412b/a/f/afnan_rare_reef_edp_100ml-1.jpeg',
    category: 'unisex', collection: 'arabian-luxury-perfume', section: 'gallery',
    tags: ['deal', 'recommended'], salesCount: 0, isNewProduct: false, inStock: true,
  },

  // ─── ARABIAN PERFUMES ──────────────────────────────────────────────────────
  {
    name: 'Lattafa Asad EDP 100ml For Men',
    brand: 'Lattafa', price: 34999, rating: 5,
    image: 'https://fragrances.com.ng/media/catalog/product/cache/553761e1c239bcd5973d5ba4fb1f412b/l/a/lattafa_asad_edp_100ml_for_men-2_1.jpg',
    category: 'men', collection: 'arabian-perfume', section: 'gallery',
    tags: ['best_seller', 'recommended'], salesCount: 20, isNewProduct: false, inStock: true,
  },
  {
    name: 'Fragrance World Oud Madness EDP 60ml',
    brand: 'Fragrance World', price: 38999, rating: 4,
    image: 'https://fragrances.com.ng/media/catalog/product/cache/553761e1c239bcd5973d5ba4fb1f412b/f/r/fragrance_world_oud_madness_edp_60ml-1.jpg',
    category: 'men', collection: 'arabian-perfume', section: 'gallery',
    tags: ['deal'], salesCount: 10, isNewProduct: false, inStock: true,
  },
  {
    name: 'Emir A Walk On Dirt EDP 100ml',
    brand: 'Emir', price: 38999, rating: 5,
    image: 'https://fragrances.com.ng/media/catalog/product/cache/553761e1c239bcd5973d5ba4fb1f412b/e/m/emir_a_walk_on_dirt_edp_100ml.jpeg',
    category: 'unisex', collection: 'arabian-perfume', section: 'gallery',
    tags: ['recommended'], salesCount: 0, isNewProduct: false, inStock: true,
  },
  {
    name: 'Fragrance World Midnight Oud EDP 100ml For Men',
    brand: 'Fragrance World', price: 23999, rating: 5,
    image: 'https://fragrances.com.ng/media/catalog/product/cache/553761e1c239bcd5973d5ba4fb1f412b/f/r/fragrance_world_midnight_oud-4.jpeg',
    category: 'men', collection: 'arabian-perfume', section: 'gallery',
    tags: ['deal', 'recommended'], salesCount: 0, isNewProduct: false, inStock: true,
  },
  {
    name: 'Fragrance World Suits EDP 100ml For Men',
    brand: 'Fragrance World', price: 24999, rating: 5,
    image: 'https://fragrances.com.ng/media/catalog/product/cache/553761e1c239bcd5973d5ba4fb1f412b/f/r/fragrance_world_suits_edp_100ml_1.jpeg',
    category: 'men', collection: 'arabian-perfume', section: 'gallery',
    tags: ['best_seller', 'recommended'], salesCount: 10, isNewProduct: false, inStock: true,
  },
];

function downloadImage(url, dest) {
  return new Promise((resolve) => {
    if (fs.existsSync(dest)) {
      const buf = fs.readFileSync(dest);
      const valid = (buf[0]===0xFF&&buf[1]===0xD8)||(buf[0]===0x89&&buf[1]===0x50)||(buf[0]===0x52&&buf[1]===0x49);
      if (valid && buf.length > 1000) { resolve(true); return; }
      fs.unlinkSync(dest);
    }
    const file = fs.createWriteStream(dest);
    const req = https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close(); fs.unlink(dest, () => {});
        downloadImage(res.headers.location, dest).then(resolve); return;
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        const buf = fs.readFileSync(dest);
        const valid = (buf[0]===0xFF&&buf[1]===0xD8)||(buf[0]===0x89&&buf[1]===0x50)||(buf[0]===0x52&&buf[1]===0x49);
        if (!valid || buf.length < 1000) { fs.unlinkSync(dest); resolve(false); }
        else resolve(true);
      });
    });
    req.on('error', () => { file.close(); fs.unlink(dest, () => {}); resolve(false); });
    req.setTimeout(15000, () => { req.destroy(); resolve(false); });
  });
}

const Schema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: String, brand: String, price: Number, rating: Number,
  image: String, isNewProduct: Boolean, salesCount: Number, inStock: Boolean,
  category: String, collection: String, section: String,
  tags: [String], cat: String,
}, { strict: false });
const Product = mongoose.model('Product', Schema, 'products');

async function seed() {
  console.log('Connecting...');
  await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 15000 });
  console.log('Connected!\n');

  await Product.deleteMany({});
  console.log('Cleared existing products\n');

  let id = 1;
  let ok = 0, fail = 0;

  for (const p of PRODUCTS) {
    const ext = p.image.split('.').pop().split('?')[0] || 'jpg';
    const filename = `${p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 60)}.${ext}`;
    const localPath = path.join(PUBLIC_DIR, filename);

    process.stdout.write(`  [${id}] ${p.name.slice(0, 45)}... `);
    const downloaded = await downloadImage(p.image, localPath);
    console.log(downloaded ? '✓' : '✗ (external URL)');

    await Product.create({
      id: id++,
      name: p.name, brand: p.brand, price: p.price, rating: p.rating,
      image: downloaded ? `/products/${filename}` : p.image,
      isNewProduct: p.isNewProduct, salesCount: p.salesCount, inStock: p.inStock,
      category: p.category, collection: p.collection, section: p.section,
      tags: p.tags, cat: null,
    });
    downloaded ? ok++ : fail++;
  }

  console.log(`\n✓ Seeded ${PRODUCTS.length} products (${ok} local images, ${fail} external)`);
  await mongoose.disconnect();
}

seed().catch(err => { console.error(err); process.exit(1); });
