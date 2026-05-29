import prisma from '../../lib/prisma.js';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

// Set test environment variables
process.env.ACCESS_TOKEN_SECRET = 'test_access_token_secret';
process.env.REFRESH_TOKEN_SECRET = 'test_refresh_token_secret';
process.env.NODE_ENV = 'test';

// Reset database before all tests
beforeAll(async () => {
    try {
        // Connect to Prisma
        await prisma.$connect();
        console.log('Connected to database for testing');
    } catch (error) {
        console.error('Failed to connect to database for testing', error);
        process.exit(1);
    }
});

// Clean up database after all tests
afterAll(async () => {
    try {
        // Delete all data from tables in reverse order of dependencies
        await prisma.post.deleteMany({});
        await prisma.video.deleteMany({});
        await prisma.product.deleteMany({});
        await prisma.user.deleteMany({});
        
        // Disconnect from Prisma
        await prisma.$disconnect();
        console.log('Disconnected from database after testing');
    } catch (error) {
        console.error('Error during test cleanup', error);
    }
});

// Clean up database after each test
afterEach(async () => {
    try {
        // Delete all data from tables in reverse order of dependencies
        await prisma.post.deleteMany({});
        await prisma.video.deleteMany({});
        await prisma.product.deleteMany({});
        await prisma.user.deleteMany({});
    } catch (error) {
        console.error('Error cleaning up after test', error);
    }
});
