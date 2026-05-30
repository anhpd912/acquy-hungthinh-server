import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mainRouter from './routes/index.js';
import { notFound, errorHandler } from './middlewares/errorHandler.js';
import { swaggerUi, swaggerSpec } from './config/swagger.js';

const app = express();

// Middleware cơ bản

// CORS configuration
const allowedOrigins = ['http://localhost:3000', 'http://localhost:8080', 'http://127.0.0.1:8080', 'https://acquyhungthinh.com.vn', 'https://www.acquyhungthinh.com.vn', 'https://api.acquyhungthinh.com.vn'];
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, or server-to-server)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
};
app.use(cors(corsOptions));

app.use(express.json()); // Parse JSON bodies
app.use(cookieParser()); // Parse cookies

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


// Welcome page
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Acquy Hung Thinh API Server</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f4f7f6;
          color: #333;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
        }
        .container {
          background-color: #fff;
          padding: 40px;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          text-align: center;
          max-width: 600px;
        }
        h1 {
          color: #2c3e50;
          margin-bottom: 20px;
        }
        p {
          font-size: 16px;
          line-height: 1.6;
          color: #555;
        }
        .links {
          margin-top: 30px;
        }
        a {
          display: inline-block;
          background-color: #3498db;
          color: white;
          text-decoration: none;
          padding: 10px 20px;
          border-radius: 5px;
          margin: 0 10px;
          transition: background-color 0.3s;
        }
        a:hover {
          background-color: #2980b9;
        }
        .status {
          margin-top: 20px;
          font-size: 14px;
          color: #27ae60;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Welcome to Acquy Hung Thinh API v1.0.1</h1>
        <p>The server is running successfully. This is the base URL for the backend services.</p>
        <div class="status">✓ Server Status: Online</div>
        <div class="links">
          <a href="/api-docs">View API Documentation</a>
        </div>
      </div>
    </body>
    </html>
  `);
});

// Định tuyến API

app.use('/api', mainRouter); // Tiền tố cho tất cả route

// Middleware xử lý lỗi
app.use(notFound);
app.use(errorHandler);

export default app;
