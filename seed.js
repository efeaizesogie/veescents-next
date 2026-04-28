const mongoose = require('mongoose');
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const MONGODB_URI = 'mongodb://efeaizesogie_db_user:0gmN9TkxOPXz80mZ@ac-a86hpii-shard-00-00.kbhuqpa.mongodb.net:27017,ac-a86hpii-shard-00-01.kbhuqpa.mongodb.net:27017,ac-a86hpii-shard-00-02.kbhuqpa.mongodb.net:27017/?ssl=true&replicaSet=atlas-14ctda-shard-0&authSource=admin&appName=veescent-cluster';

const PUBLIC_DIR = path.join(__dirname, 'public', 'products');

// All products extracted from brand.html
const PRODUCTS = [
  { name: 'Arabiyat Sugar Pecan Butter Cookie', brand: 'Arabiyat', price: 22000, image: 'https://www.fragrancewholesale.ng/wp-content/uploads/2026/04/1000047987-280x280.jpg', category: 'women', section: 'new_collection', rating: 4, isNewProduct: true },
  { name: 'Arabiyat Sugar Matcha Latte', brand: 'Arabiyat', price: 22000, image: 'https://www.fragrancewholesale.ng/wp-content/uploads/2026/04/1000047988-280x280.jpg', category: 'women', section: 'new_collection', rating: 4, isNewProduct: true },
  { name: 'Arabiyat Sugar Vanilla Cream Macaron', brand: 'Arabiyat', price: 22000, image: 'https://www.fragrancewholesale.ng/wp-content/uploads/2026/04/1000047986-280x280.jpg', category: 'women', section: 'new_collection', rating: 4, isNewProduct: true },
  { name: 'Arabiyat Sugar Strawberry Tres Leches', brand: 'Arabiyat', price: 22000, image: 'https://www.fragrancewholesale.ng/wp-content/uploads/2026/04/1000047985-280x280.jpg', category: 'women', section: 'new_collection', rating: 5, isNewProduct: true },
  { name: 'Fire on Ice Lattafa EDP', brand: 'Lattafa', price: 36000, image: 'https://www.fragrancewholesale.ng/wp-content/uploads/2026/04/1000047984-280x280.jpg', category: 'unisex', section: 'gallery', rating: 5, isNewProduct: true },
  { name: 'Arabiyat Sugar French Vanilla Latte EDP 100ml', brand: 'Arabiyat', price: 22000, image: 'https://www.fragrancewholesale.ng/wp-content/uploads/2026/04/1000047983-247x280.jpg', category: 'women', section: 'new_collection', rating: 4, isNewProduct: true },
  { name: 'Angham Second Song Lattafa 100ml Perfume', brand: 'Lattafa', price: 32000, image: 'https://www.fragrancewholesale.ng/wp-content/uploads/2026/03/img_6841-280x280.jpeg', category: 'women', section: 'gallery', rating: 4, isNewProduct: false },
  { name: 'Shahd Lattafa All Over Spray 150ml', brand: 'Lattafa', price: 13000, image: 'https://www.fragrancewholesale.ng/wp-content/uploads/2026/03/img_6842-280x280.jpeg', category: 'women', section: 'gallery', rating: 4, isNewProduct: false },
  { name: '100ml Monsieur Red Tobacco EDP', brand: 'Monsieur', price: 13000, image: 'https://www.fragrancewholesale.ng/wp-content/uploads/2025/05/img_4010-280x280.jpeg', category: 'men', section: 'gallery', rating: 4, isNewProduct: false },
  { name: 'Pretty in Pink EDP 100ml Rayhaan Perfume', brand: 'Rayhaan', price: 25000, image: 'https://www.fragrancewholesale.ng/wp-content/uploads/2026/04/img_8517-280x280.jpeg', category: 'women', section: 'gallery', rating: 5, isNewProduct: false },
  { name: 'La Fede Aura Kiss of Rose 100ml EDP KHADLAJ', brand: 'Khadlaj', price: 18000, image: 'https://www.fragrancewholesale.ng/wp-content/uploads/2026/04/img_8516-280x280.jpeg', category: 'women', section: 'gallery', rating: 4, isNewProduct: false },
  { name: 'Black Skin Aro Fac 100ml EDP', brand: 'Aro Fac', price: 18500, image: 'https://www.fragrancewholesale.ng/wp-content/uploads/2026/04/img_8514-280x280.jpeg', category: 'unisex', section: 'gallery', rating: 4, isNewProduct: false },
  { name: 'Proud of You Intense EDP 100ml Fragrance World', brand: 'Fragrance World', price: 16000, image: 'https://www.fragrancewholesale.ng/wp-content/uploads/2026/04/img_8504-280x280.jpeg', category: 'unisex', section: 'gallery', rating: 4, isNewProduct: false },
  { name: 'Peace and Love Lattafa Pride EDP 100ml', brand: 'Lattafa', price: 47000, image: 'https://www.fragrancewholesale.ng/wp-content/uploads/2026/03/img_6841-280x280.jpeg', category: 'unisex', section: 'gallery', rating: 5, isNewProduct: false },
  { name: 'Marshmallow Blush EDP 100ml Perfume', brand: 'Paris Corner', price: 45000, image: 'https://www.fragrancewholesale.ng/wp-content/uploads/2026/03/img_6838-280x280.jpeg', category: 'women', section: 'gallery', rating: 5, isNewProduct: false },
  { name: 'Rose Couture Khadlaj EDP 100ml Perfume for Women', brand: 'Khadlaj', price: 22000, image: 'https://www.fragrancewholesale.ng/wp-content/uploads/2026/03/img_6839-280x280.jpeg', category: 'women', section: 'gallery', rating: 4, isNewProduct: false },
  { name: 'Al Dirgham Ard Al Zafaran', brand: 'Ard Al Zafaran', price: 25000, image: 'https://www.fragrancewholesale.ng/wp-content/uploads/2026/03/img_6844-280x280.jpeg', category: 'men', section: 'gallery', rating: 4, isNewProduct: false },
  { name: 'Musamam Black Intense LATTAFA EDP 100ml', brand: 'Lattafa', price: 40000, image: 'https://www.fragrancewholesale.ng/wp-content/uploads/2026/03/img_6842-280x280.jpeg', category: 'men', section: 'gallery', rating: 5, isNewProduct: false },
  { name: 'Sensuous Night KHADLAJ 100ml Perfume', brand: 'Khadlaj', price: 19500, image: 'https://www.fragrancewholesale.ng/wp-content/uploads/2026/03/img_6840-280x280.jpeg', category: 'unisex', section: 'gallery', rating: 4, isNewProduct: false },
  { name: 'Proud of You Leather Fragrance World 100ml EDP', brand: 'Fragrance World', price: 16500, image: 'https://www.fragrancewholesale.ng/wp-content/uploads/2026/02/img_5742-280x280.jpeg', category: 'men', section: 'gallery', rating: 4, isNewProduct: false },
  { name: 'Opulent Dubai Lattafa 100ml Perfume', brand: 'Lattafa', price: 20000, image: 'https://www.fragrancewholesale.ng/wp-content/uploads/2026/02/img_5633-280x280.jpeg', category: 'unisex', section: 'gallery', rating: 4, isNewProduct: false },
  { name: 'Velvet Rouge EDP 100ml Fragrance World', brand: 'Fragrance World', price: 16000, image: 'https://www.fragrancewholesale.ng/wp-content/uploads/2025/12/17f0ab2e-d637-490d-ae65-047335382143-280x280.jpeg', category: 'women', section: 'gallery', rating: 4, isNewProduct: false },
  { name: 'Al Noble Ameer', brand: 'Al Noble', price: 23000, image: 'https://www.fragrancewholesale.ng/wp-content/uploads/2025/12/img_4624-280x280.png', category: 'men', section: 'gallery', rating: 4, isNewProduct: false },
  { name: 'Lamsat Harir Dubai Chocolate EDP 100ml', brand: 'Dubai Chocolate', price: 12000, image: 'https://www.fragrancewholesale.ng/wp-content/uploads/2025/12/img_4440-280x280.jpeg', category: 'women', section: 'gallery', rating: 4, isNewProduct: false },
  { name: 'Sugar Mummy EDP 100ml Perfume for Women', brand: 'Paris Corner', price: 18000, image: 'https://www.fragrancewholesale.ng/wp-content/uploads/2025/11/img_3822-280x280.jpeg', category: 'women', section: 'gallery', rating: 4, isNewProduct: false },
  { name: 'Yara Elixir Lattafa 100ml Perfume', brand: 'Lattafa', price: 30000, image: 'https://www.fragrancewholesale.ng/wp-content/uploads/2025/11/img_3801-280x280.jpeg', category: 'women', section: 'gallery', rating: 5, isNewProduct: false },
  { name: 'Asad Elixir Lattafa 100ml Perfume', brand: 'Lattafa', price: 25000, image: 'https://www.fragrancewholesale.ng/wp-content/uploads/2025/11/img_3800-280x280.jpeg', category: 'men', section: 'gallery', rating: 5, isNewProduct: false },
  { name: 'Proud of You Amber Fragrance World 100ml EDP', brand: 'Fragrance World', price: 16500, image: 'https://www.fragrancewholesale.ng/wp-content/uploads/2025/11/1140b324-54b2-4492-b200-a5769ecec828-280x280.jpeg', category: 'unisex', section: 'gallery', rating: 4, isNewProduct: false },
  { name: 'Oud Madness Fragrance World 60ml Perfume', brand: 'Fragrance World', price: 24000, image: 'https://www.fragrancewholesale.ng/wp-content/uploads/2025/11/0865b2cc-70e4-4ae2-9e62-39abdc5bce18-280x280.jpeg', category: 'men', section: 'gallery', rating: 4, isNewProduct: false },
  { name: 'One Self Fragrance World EDP 100ml', brand: 'Fragrance World', price: 16500, image: 'https://www.fragrancewholesale.ng/wp-content/uploads/2025/11/a285119d-d819-4a13-bc19-ad5f75bf0657-280x280.jpeg', category: 'unisex', section: 'gallery', rating: 4, isNewProduct: false },
  { name: 'Vanilla Freak Lattafa EDP 75ml', brand: 'Lattafa', price: 38000, image: 'https://www.fragrancewholesale.ng/wp-content/uploads/2025/11/img_3758-280x280.jpeg', category: 'women', section: 'gallery', rating: 5, isNewProduct: false },
  { name: 'Cookie Crave Lattafa EDP 75ml', brand: 'Lattafa', price: 38000, image: 'https://www.fragrancewholesale.ng/wp-content/uploads/2025/11/img_3757-280x280.jpeg', category: 'women', section: 'gallery', rating: 5, isNewProduct: false },
  { name: 'Choco Overdose Lattafa EDP 75ml', brand: 'Lattafa', price: 38000, image: 'https://www.fragrancewholesale.ng/wp-content/uploads/2025/11/img_3756-280x280.jpeg', category: 'unisex', section: 'gallery', rating: 5, isNewProduct: false },
  { name: 'Rayhaan Nocturno Pour Homme EDP 100ml', brand: 'Rayhaan', price: 35000, image: 'https://www.fragrancewholesale.ng/wp-content/uploads/2025/10/img_3304-280x280.jpeg', category: 'men', section: 'gallery', rating: 4, isNewProduct: false },
  { name: 'Afnan 9 PM Elixir 100ml Parfum Intense', brand: 'Afnan', price: 52000, image: 'https://www.fragrancewholesale.ng/wp-content/uploads/2025/10/img_3060-280x280.jpeg', category: 'men', section: 'gallery', rating: 5, isNewProduct: false },
  { name: 'Breed Cherry 100ml EDP', brand: 'Breed', price: 30000, image: 'https://www.fragrancewholesale.ng/wp-content/uploads/2025/09/img_2722-280x280.jpeg', category: 'unisex', section: 'gallery', rating: 4, isNewProduct: false },
  { name: 'Breed Wanted 100ml EDP', brand: 'Breed', price: 27000, image: 'https://www.fragrancewholesale.ng/wp-content/uploads/2025/09/img_2720-280x280.jpeg', category: 'men', section: 'gallery', rating: 4, isNewProduct: false },
  { name: 'Rayhaan Tiger 100ml EDP', brand: 'Rayhaan', price: 43000, image: 'https://www.fragrancewholesale.ng/wp-content/uploads/2025/09/img_2725-280x280.jpeg', category: 'men', section: 'gallery', rating: 5, isNewProduct: false },
  { name: 'Rayhaan Lion EDP 100ml', brand: 'Rayhaan', price: 45000, image: 'https://www.fragrancewholesale.ng/wp-content/uploads/2025/12/img_4871-280x280.jpeg', category: 'men', section: 'gallery', rating: 5, isNewProduct: false },
];

function downloadImage(url, dest) {
  return new Promise((resolve) => {
    if (fs.existsSync(dest)) { resolve(true); return; }
    const proto = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(dest);
    proto.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        fs.unlink(dest, () => {});
        downloadImage(res.headers.location, dest).then(resolve);
        return;
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(true); });
    }).on('error', (err) => {
      file.close();
      fs.unlink(dest, () => {});
      console.log(`  ⚠ Failed to download: ${url} — ${err.message}`);
      resolve(false);
    });
  });
}

const ProductSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: String, brand: String, price: Number, rating: Number,
  image: String, isNewProduct: Boolean,
  category: String, section: String,
  inStock: { type: Boolean, default: true },
});
const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

async function seed() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 15000 });
  console.log('Connected!\n');

  // Get current max id
  const last = await Product.findOne().sort({ id: -1 });
  let nextId = last ? last.id + 1 : 1;

  let inserted = 0, skipped = 0, failed = 0;

  for (const p of PRODUCTS) {
    // Check if already exists by name
    const exists = await Product.findOne({ name: p.name });
    if (exists) { console.log(`  ↷ Skip (exists): ${p.name}`); skipped++; continue; }

    // Download image
    const ext = p.image.split('.').pop().split('?')[0] || 'jpg';
    const filename = `${p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 50)}.${ext}`;
    const localPath = path.join(PUBLIC_DIR, filename);
    const publicPath = `/products/${filename}`;

    process.stdout.write(`  ↓ Downloading image for: ${p.name}... `);
    const ok = await downloadImage(p.image, localPath);
    console.log(ok ? '✓' : '✗ (using original URL)');

    try {
      await Product.create({
        id: nextId++,
        name: p.name,
        brand: p.brand,
        price: p.price,
        rating: p.rating,
        image: ok ? publicPath : p.image,
        isNewProduct: p.isNewProduct,
        category: p.category,
        section: p.section,
        inStock: true,
      });
      console.log(`  ✓ Inserted: ${p.name}`);
      inserted++;
    } catch (err) {
      console.log(`  ✗ Failed to insert ${p.name}: ${err.message}`);
      failed++;
    }
  }

  console.log(`\nDone! Inserted: ${inserted}, Skipped: ${skipped}, Failed: ${failed}`);
  await mongoose.disconnect();
}

seed().catch(err => { console.error(err); process.exit(1); });
