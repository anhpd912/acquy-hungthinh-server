import * as productService from '../services/product.service.js';
import { sendResponse } from '../utils/responseHandler.js';
import { ApiError } from '../utils/ApiError.js';

export const create = async (req, res, next) => {
    try {
        const productData = {
            ...req.body,
            imageUrls: req.cloudinaryUrls || [],
            imagePublicIds: req.cloudinaryPublicIds || []
        };
        const product = await productService.createProduct(productData);
        sendResponse(res, 201, 'Product created successfully', product);
    } catch (error) {
        next(error);
    }
};

export const getAll = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, search, dongSanPham } = req.query;
        const filters = { search, dongSanPham };
        const options = { page: parseInt(page, 10), limit: parseInt(limit, 10) };
        const result = await productService.getAllProducts(filters, options);
        sendResponse(res, 200, 'Products retrieved successfully', result);
    } catch (error) {
        next(error);
    }
};

export const getById = async (req, res, next) => {
    try {
        const product = await productService.getProductById(req.params.id);
        if (!product) {
            throw new ApiError(404, 'Product not found');
        }
        sendResponse(res, 200, 'Product retrieved successfully', product);
    } catch (error) {
        next(error);
    }
};

export const update = async (req, res, next) => {
    try {
        const productData = {
            ...req.body
        };
        
        if (req.cloudinaryUrls && req.cloudinaryUrls.length > 0) {
            productData.imageUrls = req.cloudinaryUrls;
            productData.imagePublicIds = req.cloudinaryPublicIds;
        }

        const product = await productService.updateProductById(req.params.id, productData);
        sendResponse(res, 200, 'Product updated successfully', product);
    } catch (error) {
        next(error);
    }
};

export const remove = async (req, res, next) => {
    try {
        await productService.deleteProductById(req.params.id);
        sendResponse(res, 200, 'Product deleted successfully');
    } catch (error) {
        next(error);
    }
};
