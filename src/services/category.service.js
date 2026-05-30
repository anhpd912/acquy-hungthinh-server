import prisma from '../lib/prisma.js';
import { ApiError } from '../utils/ApiError.js';

export const createCategory = async (data) => {
    const existing = await prisma.category.findUnique({ where: { name: data.name } });
    if (existing) throw new ApiError(400, 'Tên loại ắc quy đã tồn tại');
    return await prisma.category.create({ data });
};

export const getAllCategories = async () => {
    return await prisma.category.findMany({
        include: { _count: { select: { products: true } } }
    });
};

export const getCategoryById = async (id) => {
    const category = await prisma.category.findUnique({
        where: { id },
        include: { products: true }
    });
    if (!category) throw new ApiError(404, 'Không tìm thấy loại ắc quy này');
    return category;
};

export const updateCategory = async (id, data) => {
    return await prisma.category.update({
        where: { id },
        data
    }).catch(() => { throw new ApiError(404, 'Không tìm thấy loại ắc quy này'); });
};

export const deleteCategory = async (id) => {
    const productsCount = await prisma.product.count({ where: { categoryId: id } });
    if (productsCount > 0) throw new ApiError(400, 'Không thể xóa loại đang chứa sản phẩm');
    
    return await prisma.category.delete({ where: { id } })
        .catch(() => { throw new ApiError(404, 'Không tìm thấy loại ắc quy này'); });
};
