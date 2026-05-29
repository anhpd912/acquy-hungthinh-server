import prisma from '../lib/prisma.js';

export const createVideo = async (videoData) => {
    return await prisma.video.create({
        data: videoData
    });
};

export const getAllVideos = async (page = 1, limit = 10) => {
    const videos = await prisma.video.findMany({
        where: { isDeleted: false },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
    });
    
    const totalVideos = await prisma.video.count({ where: { isDeleted: false } });
    
    return {
        videos,
        totalPages: Math.ceil(totalVideos / limit),
        currentPage: page,
    };
};

export const getVideoById = async (id) => {
    return await prisma.video.findUnique({
        where: { id },
        include: { author: true }
    });
};

export const updateVideoById = async (id, updateData) => {
    return await prisma.video.update({
        where: { id },
        data: updateData,
    });
};

export const softDeleteVideoById = async (id) => {
    return await prisma.video.update({
        where: { id },
        data: { isDeleted: true },
    });
};
