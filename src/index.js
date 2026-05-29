import dotenv from 'dotenv';
import app from './app.js';
import prisma from './lib/prisma.js';

dotenv.config({
    path: './.env'
});

const startServer = async () => {
    try {
        await prisma.$connect();
        console.log('Database connected successfully');

        app.listen(process.env.PORT || 8000, () => {
            console.log('Server is running on port ' + (process.env.PORT || 8000));
        });

    } catch (error) {
        console.error("Failed to connect to the database", error);
        await prisma.$disconnect();
        process.exit(1);
    }
};

startServer();
