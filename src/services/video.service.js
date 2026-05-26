import Video from '../models/video.model.js';

export const createVideo = async (videoData) => {
    const video = new Video(videoData);
    return await video.save();
};

export const getAllVideos = async (page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    const videos = await Video.find({ isDeleted: false }).skip(skip).limit(limit).sort({ createdAt: -1 });
    const totalVideos = await Video.countDocuments({ isDeleted: false });
    return {
        videos,
        totalPages: Math.ceil(totalVideos / limit),
        currentPage: page,
    };
};

export const getVideoById = async (id) => {
    const video = await Video.findOne({ _id: id, isDeleted: false });
    return video;
};

export const updateVideoById = async (id, updateData) => {
    return await Video.findByIdAndUpdate(id, updateData, { new: true });
};

export const softDeleteVideoById = async (id) => {
    return await Video.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
};