import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Product from './src/models/product.model.js';

dotenv.config({ path: './.env' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const seedProducts = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Read the data.json file from the frontend folder
        const dataPath = join(__dirname, '..', 'acquy-hungthinh', 'data.json');
        const data = JSON.parse(await readFile(dataPath, 'utf-8'));

        // Clear existing products
        await Product.deleteMany({});
        console.log('Cleared existing products');

        // Insert new products
        const products = await Product.insertMany(data);
        console.log(`Successfully seeded ${products.length} products`);

        process.exit(0);
    } catch (error) {
        console.error('Error seeding products:', error);
        process.exit(1);
    }
};

seedProducts();
