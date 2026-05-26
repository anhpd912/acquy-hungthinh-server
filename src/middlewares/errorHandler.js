import { sendResponse } from '../utils/responseHandler.js';

// Middleware to handle 404 (Not Found) errors
export const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

// Middleware for global error handling
export const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    const data = {
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    };
    sendResponse(res, statusCode, err.message, data);
};
