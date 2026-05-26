import * as videoService from '../services/video.service.js';
import { sendResponse } from '../utils/responseHandler.js';

export const create = async (req, res, next) => {
    try {
        // Extract Cloudinary URL from the request object (added by the middleware)
        const videoUrls = req.cloudinaryUrl ? [req.cloudinaryUrl] : [];
        // You can also store public_id if you need to delete the file later
        // const videoPublicIds = req.cloudinaryPublicId ? [req.cloudinaryPublicId] : [];

        const videoData = {
            ...req.body,
            videoUrls: videoUrls,
            // Add other fields if needed, e.g., createdBy from authenticated user
            createdBy: req.user.id // Assuming req.user is attached by authenticate middleware
        };

        const video = await videoService.createVideo(videoData);
        sendResponse(res, 201, 'Video created successfully', video);
    } catch (error) {
        next(error);
    }
};

export const getAll = async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const result = await videoService.getAllVideos(parseInt(page, 10), parseInt(limit, 10));
        sendResponse(res, 200, 'Videos retrieved successfully', result);
    } catch (error) {
        next(error);
    }
};

export const getById = async (req, res, next) => {
    try {
        const video = await videoService.getVideoById(req.params.id);
        if (!video) {
            return sendResponse(res, 404, 'Video not found');
        }
        sendResponse(res, 200, 'Video retrieved successfully', video);
    } catch (error) {
        next(error);
    }
};

export const update = async (req, res, next) => {
    try {
        // Handle potential file upload for update as well, if applicable
        // For simplicity here, we are only updating text fields.
        // If you need to handle file updates, you'll need to adjust the middleware and controller logic.
        const videoData = {
            ...req.body,
            createdBy: req.user.id // Ensure user is authenticated for updates if needed
        };
        const video = await videoService.updateVideoById(req.params.id, videoData);
        if (!video) {
            return sendResponse(res, 404, 'Video not found');
        }
        sendResponse(res, 200, 'Video updated successfully', video);
    } catch (error) {
        next(error);
    }
};

export const softDelete = async (req, res, next) => {
    try {
        const video = await videoService.softDeleteVideoById(req.params.id);
        if (!video) {
            return sendResponse(res, 404, 'Video not found');
        }
        // Optional: Delete from Cloudinary as well
        // if (video.videoUrls && video.videoUrls.length > 0) {
        //     // You'd need to extract public IDs from videoUrls or store them separately
        //     // Example: await cloudinary.uploader.destroy(public_id);
        // }
        sendResponse(res, 200, 'Video deleted successfully');
    } catch (error) {
        next(error);
    }
};
