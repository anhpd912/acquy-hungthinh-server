import prisma from '../lib/prisma.js';
import { ApiError } from '../utils/ApiError.js';

export const createProduct = async (productData) => {
    const existingProduct = await prisma.product.findUnique({
        where: { kyHieuMaSanPham: productData.kyHieuMaSanPham }
    });
    
    if (existingProduct) {
        throw new ApiError(409, 'Sản phẩm với mã ký hiệu này đã tồn tại.');
    }
    
    return await prisma.product.create({
        data: productData
    });
};

export const getProductById = async (id) => {
    return await prisma.product.findUnique({
        where: { id, isDeleted: false },
        include: { category: true }
    });
};

export const getAllProducts = async (filters, options) => {
    const { page = 1, limit = 10 } = options;
    const { keyword, categoryId, search} = filters;

    const where = { isDeleted: false };
    
    // Tìm kiếm theo từ khóa (Keyword) hoặc search
    const searchTerm = keyword || search;
    if (searchTerm) {
        where.OR = [
            { tenSanPham: { contains: searchTerm } },
            { kyHieuMaSanPham: { contains: searchTerm } },
            { category: { name: { contains: searchTerm } } }
        ];
    }
    
    // Lọc theo Category
    if (categoryId) {
        where.categoryId = categoryId;
    }

    

    const products = await prisma.product.findMany({
        where,
        include: { category: true },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * Number(limit),
        take: Number(limit),
    });

    const totalProducts = await prisma.product.count({ where });

    return {
        products,
        totalPages: Math.ceil(totalProducts / limit),
        currentPage: Number(page),
        totalProducts,
    };
};

export const updateProductById = async (id, updateData) => {
    return await prisma.product.update({
        where: { id },
        data: updateData,
    });
};

export const deleteProductById = async (id) => {
    return await prisma.product.update({
        where: { id },
        data: { isDeleted: true },
    });
};
