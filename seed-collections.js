const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb://efeaizesogie_db_user:0gmN9TkxOPXz80mZ@ac-a86hpii-shard-00-00.kbhuqpa.mongodb.net:27017,ac-a86hpii-shard-00-01.kbhuqpa.mongodb.net:27017,ac-a86hpii-shard-00-02.kbhuqpa.mongodb.net:27017/?ssl=true&replicaSet=atlas-14ctda-shard-0&authSource=admin&appName=veescent-cluster';

const CollectionSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  image: { type: String, required: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

const Collection = mongoose.models.Collection || mongoose.model('Collection', CollectionSchema);

const COLLECTIONS = [
  {
    id: 1,
    name: 'Original Designer Perfume',
    slug: 'original-designer-perfume',
    description: 'Authentic luxury designer fragrances from the world\'s most prestigious houses.',
    image: '/products/original-designer-perfume.jpeg',
    order: 1,
  },
  {
    id: 2,
    name: 'Arabian Luxury Perfume',
    slug: 'arabian-luxury-perfume',
    description: 'Premium Arabian luxury fragrances crafted with the finest oud and exotic ingredients.',
    image: '/products/arabian-luxury-perfume.webp',
    order: 2,
  },
  {
    id: 3,
    name: 'Arabian Perfume',
    slug: 'arabian-perfume',
    description: 'Rich and captivating Arabian scents inspired by the mystique of the Middle East.',
    image: '/products/arabian-perfume.webp',
    order: 3,
  },
  {
    id: 4,
    name: 'Perfume Oil',
    slug: 'perfume-oil',
    description: 'Long-lasting concentrated perfume oils for an intimate and personal fragrance experience.',
    image: '/products/perfume-oil.jpg',
    order: 4,
  },
  {
    id: 5,
    name: 'Body Spray',
    slug: 'body-spray',
    description: 'Light and refreshing body sprays perfect for everyday wear.',
    image: '/products/body-spray.jpg',
    order: 5,
  },
  {
    id: 6,
    name: 'Body Mist',
    slug: 'body-mist',
    description: 'Delicate and moisturising body mists that leave a subtle, lasting fragrance.',
    image: '/products/body-mist.jpg',
    order: 6,
  },
  {
    id: 7,
    name: 'Perfume Gift Sets',
    slug: 'perfume-gift-set',
    description: 'Beautifully curated fragrance gift sets — perfect for every occasion.',
    image: '/products/gift-set.jpeg',
    order: 7,
  },
  {
    id: 8,
    name: 'Diffuser',
    slug: 'diffuser',
    description: 'Elegant home diffusers to fill your space with luxurious, long-lasting scents.',
    image: '/products/diffuser.webp',
    order: 8,
  },
  {
    id: 9,
    name: 'Kiddies',
    slug: 'kiddies',
    description: 'Safe and gentle fragrances specially formulated for children.',
    image: '/products/kiddies.jpg',
    order: 9,
  },
  {
    id: 10,
    name: 'Combos',
    slug: 'combo',
    description: 'Unbeatable value combo deals — get more of what you love for less.',
    image: '/products/combo.webp',
    order: 10,
  },
];

async function seed() {
  console.log('Connecting...');
  await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 15000 });
  console.log('Connected!\n');

  await Collection.deleteMany({});
  console.log('Cleared existing collections\n');

  for (const col of COLLECTIONS) {
    await Collection.create(col);
    console.log(`✓ ${col.name} → ${col.image}`);
  }

  console.log(`\nDone! Seeded ${COLLECTIONS.length} collections.`);
  await mongoose.disconnect();
}

seed().catch(err => { console.error(err); process.exit(1); });
