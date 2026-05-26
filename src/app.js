import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mainRouter from './routes/index.js';
import { notFound, errorHandler } from './middlewares/errorHandler.js';
import { swaggerUi, swaggerSpec } from './config/swagger.js';

const app = express();

// Middleware cơ bản
app.use(cors());
app.use(express.json()); // Parse JSON bodies
app.use(cookieParser()); // Parse cookies

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Định tuyến API
app.use('/api', mainRouter); // Tiền tố cho tất cả route

// Middleware xử lý lỗi
app.use(notFound);
app.use(errorHandler);

export default app;
