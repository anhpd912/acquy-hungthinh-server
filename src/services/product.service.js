import prisma from '../lib/prisma.js';
import { ApiError } from '../utils/ApiError.js';

export const createProduct = async (productData) => {
    const existingProduct = await prisma.product.findUnique({
        where: { kyHieuMaSanPham: productData.kyHieuMaSanPham }
    });
    
    if (existingProduct) {
        throw new ApiError(409, 'Product with this model code already exists.');
    }
    
    return await prisma.product.create({
        data: productData
    });
};

export const getProductById = async (id) => {
    return await prisma.product.findUnique({
        where: { id, isDeleted: false }
    });
};

export const getAllProducts = async (filters, options) => {
    const { page = 1, limit = 10 } = options;
    const { search, dongSanPham } = filters;

    const where = { isDeleted: false };
    
    if (search) {
        where.OR = [
            { tenSanPham: { contains: search, mode: 'insensitive' } },
            { kyHieuMaSanPham: { contains: search, mode: 'insensitive' } },
        ];
    }
    
    if (dongSanPham) {
        where.dongSanPham = dongSanPham;
    }

    const products = await prisma.product.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
    });

    const totalProducts = await prisma.product.count({ where });

    return {
        products,
        totalPages: Math.ceil(totalProducts / limit),
        currentPage: page,
        totalProducts,
    };
};

export const updateProductById = async (id, updateData) => {
    const product = await prisma.product.update({
        where: { id, isDeleted: false },
        data: updateData,
    });
    
    if (!product) {
        throw new ApiError(404, 'Product not found');
    }
    
    return product;
};

export const deleteProductById = async (id) => {
    const product = await prisma.product.update({
        where: { id, isDeleted: false },
        data: { isDeleted: true },
    });
    
    if (!product) {
        throw new ApiError(404, 'Product not found');
    }
    
    return { message: 'Product deleted successfully' };
};
