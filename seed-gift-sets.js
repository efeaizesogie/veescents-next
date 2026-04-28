const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb://efeaizesogie_db_user:0gmN9TkxOPXz80mZ@ac-a86hpii-shard-00-00.kbhuqpa.mongodb.net:27017,ac-a86hpii-shard-00-01.kbhuqpa.mongodb.net:27017,ac-a86hpii-shard-00-02.kbhuqpa.mongodb.net:27017/?ssl=true&replicaSet=atlas-14ctda-shard-0&authSource=admin&appName=veescent-cluster';

const GIFT_SETS = [
  {
    name: 'Lattafa Asad Collection EDP 4x25ml 4 Piece Gift Set',
    brand: 'Lattafa', price: 46999, rating: 5, category: 'unisex',
    collection: 'perfume-gift-set', section: 'gallery', cat: 'gift_set',
    tags: ['recommended'], salesCount: 0, isNewProduct: false, inStock: true,
    image: 'https://fragrances.com.ng/media/catalog/product/cache/553761e1c239bcd5973d5ba4fb1f412b/l/a/lattafa_asad_collection_edp_4x25ml_4_piece_gift_set-1.jpg',
  },
  {
    name: 'Lattafa Badee Al Oud Sublime EDP 100ml 3 Piece Gift Set',
    brand: 'Lattafa', price: 48999, rating: 5, category: 'unisex',
    collection: 'perfume-gift-set', section: 'gallery', cat: 'gift_set',
    tags: ['recommended'], salesCount: 0, isNewProduct: false, inStock: true,
    image: 'https://fragrances.com.ng/media/catalog/product/cache/553761e1c239bcd5973d5ba4fb1f412b/l/a/lattafa_badee_al_oud_sublime_edp_3_piece_gift_set-.jpeg',
  },
  {
    name: 'Lattafa Badee Al Oud EDP 25ml 4 Piece Gift Set',
    brand: 'Lattafa', price: 44999, rating: 5, category: 'unisex',
    collection: 'perfume-gift-set', section: 'gallery', cat: 'gift_set',
    tags: ['recommended'], salesCount: 0, isNewProduct: false, inStock: true,
    image: 'https://fragrances.com.ng/media/catalog/product/cache/553761e1c239bcd5973d5ba4fb1f412b/l/a/lattafa_badee_al_oud_edp_25ml_4_piece_gift_set-1.jpeg',
  },
  {
    name: 'Lattafa Khamrah EDP 100ml 3 Piece Gift Set',
    brand: 'Lattafa', price: 59999, rating: 5, category: 'unisex',
    collection: 'perfume-gift-set', section: 'gallery', cat: 'gift_set',
    tags: ['best_seller', 'recommended'], salesCount: 15, isNewProduct: false, inStock: true,
    image: 'https://fragrances.com.ng/media/catalog/product/cache/553761e1c239bcd5973d5ba4fb1f412b/l/a/lattafa_khamrah_edp_100ml_3_piece_gift_set-1.jpeg',
  },
  {
    name: 'Arabiyat My Perfumes Lamsat Harir Gold 2 Piece EDP 100ml Gift Set',
    brand: 'Arabiyat', price: 29999, rating: 4, category: 'women',
    collection: 'perfume-gift-set', section: 'gallery', cat: 'gift_set',
    tags: ['recommended'], salesCount: 0, isNewProduct: false, inStock: true,
    image: 'https://fragrances.com.ng/media/catalog/product/cache/553761e1c239bcd5973d5ba4fb1f412b/a/r/arabiyat_my_perfumes_lamsat_harir_gold_2_piece_edp_100ml_gift_set.jpg',
  },
  {
    name: 'Lattafa The Kingdom 3 Piece Gift Set EDP 100ml',
    brand: 'Lattafa', price: 49999, rating: 5, category: 'unisex',
    collection: 'perfume-gift-set', section: 'gallery', cat: 'gift_set',
    tags: ['recommended'], salesCount: 0, isNewProduct: false, inStock: true,
    image: 'https://fragrances.com.ng/media/catalog/product/cache/553761e1c239bcd5973d5ba4fb1f412b/l/a/lattafa_the_kingdom_3_piece_gift_set_edp_100ml-6.jpeg',
  },
  {
    name: 'Lattafa Fakhar 3 Piece Gift Set EDP 100ml',
    brand: 'Lattafa', price: 44999, rating: 5, category: 'men',
    collection: 'perfume-gift-set', section: 'gallery', cat: 'gift_set',
    tags: [], salesCount: 0, isNewProduct: false, inStock: false,
    image: 'https://fragrances.com.ng/media/catalog/product/cache/553761e1c239bcd5973d5ba4fb1f412b/l/a/lattafa_fakhar_3_piece_gift_set_edp_100ml.jpeg',
  },
  {
    name: 'Lattafa Teriaq 3 Piece Gift Set EDP 100ml',
    brand: 'Lattafa', price: 58999, rating: 5, category: 'unisex',
    collection: 'perfume-gift-set', section: 'gallery', cat: 'gift_set',
    tags: ['recommended'], salesCount: 0, isNewProduct: false, inStock: true,
    image: 'https://fragrances.com.ng/media/catalog/product/cache/553761e1c239bcd5973d5ba4fb1f412b/l/a/lattafa_teriaq_3_piece_gift_set_edp_100ml-3.jpg',
  },
  {
    name: 'Lattafa Yara Candy 3 Piece Gift Set EDP 100ml',
    brand: 'Lattafa', price: 48999, rating: 5, category: 'women',
    collection: 'perfume-gift-set', section: 'gallery', cat: 'gift_set',
    tags: ['recommended'], salesCount: 0, isNewProduct: false, inStock: true,
    image: 'https://fragrances.com.ng/media/catalog/product/cache/553761e1c239bcd5973d5ba4fb1f412b/l/a/lattafa_yara_candy_3_piece_gift_set_edp_100ml.jpeg',
  },
  {
    name: 'Arabiyat My Perfumes Oud Layl Aswad EDP 100ml 2 Piece Gift Set',
    brand: 'Arabiyat', price: 24999, rating: 4, category: 'unisex',
    collection: 'perfume-gift-set', section: 'gallery', cat: 'gift_set',
    tags: [], salesCount: 0, isNewProduct: false, inStock: true,
    image: 'https://fragrances.com.ng/media/catalog/product/cache/553761e1c239bcd5973d5ba4fb1f412b/a/r/arabiyat_my_perfumes_oud_layl_aswad_edp_100ml_2_pice_gift_set.jpg',
  },
  {
    name: 'Arabiyat Al Faris Arabe EDP 100ml 2 Piece Gift Set',
    brand: 'Arabiyat', price: 24999, rating: 4, category: 'men',
    collection: 'perfume-gift-set', section: 'gallery', cat: 'gift_set',
    tags: [], salesCount: 0, isNewProduct: false, inStock: true,
    image: 'https://fragrances.com.ng/media/catalog/product/cache/553761e1c239bcd5973d5ba4fb1f412b/a/r/arabiyat_al_faris_arabe_edp_100ml_2_pice_gift_set.jpg',
  },
  {
    name: 'Arabiyat Al Faris Kenz EDP 100ml 2 Piece Gift Set',
    brand: 'Arabiyat', price: 24999, rating: 4, category: 'men',
    collection: 'perfume-gift-set', section: 'gallery', cat: 'gift_set',
    tags: [], salesCount: 0, isNewProduct: false, inStock: true,
    image: 'https://fragrances.com.ng/media/catalog/product/cache/553761e1c239bcd5973d5ba4fb1f412b/a/r/arabiyat_al_faris_kenz_edp_100ml_2_pice_gift_set.jpg',
  },
  {
    name: 'Arabiyat My Perfumes Midnight Edition 100ml 2 Piece Gift Set',
    brand: 'Arabiyat', price: 24999, rating: 4, category: 'unisex',
    collection: 'perfume-gift-set', section: 'gallery', cat: 'gift_set',
    tags: [], salesCount: 0, isNewProduct: false, inStock: true,
    image: 'https://fragrances.com.ng/media/catalog/product/cache/553761e1c239bcd5973d5ba4fb1f412b/a/r/arabiyat_my_perfumes_midnight_edition_100ml_2_pice_gift_set_1.jpg',
  },
  {
    name: 'Ferragamo Spicy Leather Pour Homme EDP 100ml 3 Piece Gift Set',
    brand: 'Salvatore Ferragamo', price: 154999, rating: 5, category: 'men',
    collection: 'perfume-gift-set', section: 'gallery', cat: 'gift_set',
    tags: ['recommended'], salesCount: 0, isNewProduct: false, inStock: true,
    image: 'https://fragrances.com.ng/media/catalog/product/cache/553761e1c239bcd5973d5ba4fb1f412b/f/e/ferragamo_spicy_leather_pour_homme_edp_100ml_3_piece_gift_set.jpeg',
  },
  {
    name: 'Montblanc Explorer Platinum EDP 100ml 3 Piece Gift Set',
    brand: 'Montblanc', price: 174999, rating: 5, category: 'men',
    collection: 'perfume-gift-set', section: 'gallery', cat: 'gift_set',
    tags: ['recommended'], salesCount: 0, isNewProduct: false, inStock: true,
    image: 'https://fragrances.com.ng/media/catalog/product/cache/553761e1c239bcd5973d5ba4fb1f412b/m/o/montblanc_explorer_platinum_edp_100ml_3_piece_gift_set.jpeg',
  },
  {
    name: 'Versace Yellow Diamond EDT 90ml 4 Piece Gift Set',
    brand: 'Versace', price: 189999, rating: 5, category: 'women',
    collection: 'perfume-gift-set', section: 'gallery', cat: 'gift_set',
    tags: ['recommended', 'best_seller'], salesCount: 5, isNewProduct: false, inStock: true,
    image: 'https://fragrances.com.ng/media/catalog/product/cache/553761e1c239bcd5973d5ba4fb1f412b/v/e/versace_yellow_diamond_edt_90ml_4_piece_gift_set_for_women.jpg',
  },
  {
    name: 'Riiffs Stella & Luna EDP 50ml x2',
    brand: 'Riiffs', price: 39999, rating: 4, category: 'women',
    collection: 'perfume-gift-set', section: 'gallery', cat: 'gift_set',
    tags: [], salesCount: 0, isNewProduct: false, inStock: true,
    image: 'https://fragrances.com.ng/media/catalog/product/cache/553761e1c239bcd5973d5ba4fb1f412b/r/i/riiffs_stella_luna_edp_100ml-1.jpeg',
  },
  {
    name: '6 Litres Aromatherapy Essential Oil Floor Standing Ultrasonic Air Humidifier',
    brand: 'Generic', price: 79999, rating: 4, category: 'unisex',
    collection: 'perfume-gift-set', section: 'gallery', cat: 'gift_set',
    tags: [], salesCount: 0, isNewProduct: false, inStock: true,
    image: 'https://fragrances.com.ng/media/catalog/product/cache/553761e1c239bcd5973d5ba4fb1f412b/u/l/ultrasonic_humidifier_6_litres_large_capacity_water_tank_floor_standing_knob_control_cool_air_humidifier_for_home.jpeg',
  },
  {
    name: 'Zara Ebony Wood Elixir Parfum Zara Emotions 100ml',
    brand: 'Zara', price: 79999, rating: 4, category: 'men',
    collection: 'perfume-gift-set', section: 'gallery', cat: 'gift_set',
    tags: [], salesCount: 0, isNewProduct: false, inStock: false,
    image: 'https://fragrances.com.ng/media/catalog/product/cache/553761e1c239bcd5973d5ba4fb1f412b/z/a/zara_ebony_wood_elixir_parfum_zara_emotions_100ml-1.jpg',
  },
  {
    name: 'Zara Night Pour Homme II + III Infinite Heritage Selection EDP 100ml',
    brand: 'Zara', price: 84999, rating: 4, category: 'men',
    collection: 'perfume-gift-set', section: 'gallery', cat: 'gift_set',
    tags: [], salesCount: 0, isNewProduct: false, inStock: false,
    image: 'https://fragrances.com.ng/media/catalog/product/cache/553761e1c239bcd5973d5ba4fb1f412b/z/a/zara_night_pour_homme_ii_iii_infinite_heritage_selection_edp_100ml_x2-1.jpg',
  },
  {
    name: 'Afnan Supremacy Not Only Intense EDP 100ml 3 Piece Gift Set For Men',
    brand: 'Afnan', price: 154999, rating: 5, category: 'men',
    collection: 'perfume-gift-set', section: 'gallery', cat: 'gift_set',
    tags: ['recommended'], salesCount: 0, isNewProduct: false, inStock: false,
    image: 'https://fragrances.com.ng/media/catalog/product/cache/553761e1c239bcd5973d5ba4fb1f412b/a/f/afnan_supremacy_not_only_intense_edp_100ml_3_piece_gift_set_2.jpg',
  },
  {
    name: 'Lattafa Pride Queen of Arabia EDP 100ml 3 Piece Gift Set',
    brand: 'Lattafa', price: 64999, rating: 5, category: 'women',
    collection: 'perfume-gift-set', section: 'gallery', cat: 'gift_set',
    tags: ['recommended'], salesCount: 0, isNewProduct: false, inStock: true,
    image: 'https://fragrances.com.ng/media/catalog/product/cache/553761e1c239bcd5973d5ba4fb1f412b/l/a/lattafa_pride_queen_of_arabia_edp_100ml_3_piece_gift_set.jpg',
  },
  {
    name: 'Lattafa Pride Nebras EDP 100ml 3 Piece Gift Set',
    brand: 'Lattafa', price: 64999, rating: 5, category: 'unisex',
    collection: 'perfume-gift-set', section: 'gallery', cat: 'gift_set',
    tags: ['recommended'], salesCount: 0, isNewProduct: false, inStock: true,
    image: 'https://fragrances.com.ng/media/catalog/product/cache/553761e1c239bcd5973d5ba4fb1f412b/l/a/lattafa_pride_nebras_edp_100ml_3_piece_gift_set.jpeg',
  },
  {
    name: 'Lattafa Pride Eternal Oud EDP 100ml 3 Piece Gift Set',
    brand: 'Lattafa', price: 64999, rating: 5, category: 'unisex',
    collection: 'perfume-gift-set', section: 'gallery', cat: 'gift_set',
    tags: ['recommended'], salesCount: 0, isNewProduct: false, inStock: true,
    image: 'https://fragrances.com.ng/media/catalog/product/cache/553761e1c239bcd5973d5ba4fb1f412b/l/a/lattafa_pride_eternal_oud_edp_100ml_3_piece_gift_set.jpeg',
  },
];

const ProductSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: String, brand: String, price: Number, rating: Number,
  image: String, isNewProduct: Boolean, salesCount: Number, inStock: Boolean,
  category: String, collection: String, section: String, cat: String,
  tags: [String],
}, { strict: false });

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

async function seed() {
  console.log('Connecting...');
  await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 15000 });
  console.log('Connected!\n');

  const last = await Product.findOne().sort({ id: -1 });
  let nextId = last ? last.id + 1 : 1;

  let inserted = 0, skipped = 0;

  for (const p of GIFT_SETS) {
    const exists = await Product.findOne({ name: p.name });
    if (exists) {
      console.log(`  ↷ Skip (exists): ${p.name}`);
      skipped++;
      continue;
    }
    await Product.create({ ...p, id: nextId++ });
    console.log(`  ✓ Inserted: ${p.name}`);
    inserted++;
  }

  console.log(`\nDone! Inserted: ${inserted}, Skipped: ${skipped}`);
  await mongoose.disconnect();
}

seed().catch(err => { console.error(err); process.exit(1); });
