import prisma from '../lib/prisma.js';

export const createPost = async (postData) => {
    return await prisma.post.create({
        data: postData
    });
};

export const getAllPosts = async (page = 1, limit = 10) => {
    const posts = await prisma.post.findMany({
        where: { isDeleted: false },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
    });
    
    const totalPosts = await prisma.post.count({ where: { isDeleted: false } });
    
    return {
        posts,
        totalPages: Math.ceil(totalPosts / limit),
        currentPage: page,
    };
};

export const getPostById = async (id) => {
    return await prisma.post.findUnique({
        where: { id },
        include: { author: true }
    });
};

export const updatePostById = async (id, updateData) => {
    return await prisma.post.update({
        where: { id },
        data: updateData,
    });
};

export const softDeletePostById = async (id) => {
    return await prisma.post.update({
        where: { id },
        data: { isDeleted: true },
    });
};
