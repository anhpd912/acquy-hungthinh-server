import * as postService from '../services/post.service.js';
import { sendResponse } from '../utils/responseHandler.js';

export const create = async (req, res, next) => {
    try {
        // Extract Cloudinary URLs from the request object (added by the middleware)
        const imageUrls = req.cloudinaryUrls || [];
        // You can also store public_ids if you need to delete the files later
        // const imagePublicIds = req.cloudinaryPublicIds || [];

        const postData = {
            ...req.body,
            imageUrls: imageUrls,
            // Add other fields if needed, e.g., createdBy from authenticated user
            createdBy: req.user.id // Assuming req.user is attached by authenticate middleware
        };

        const post = await postService.createPost(postData);
        sendResponse(res, 201, 'Post created successfully', post);
    } catch (error) {
        next(error);
    }
};

export const getAll = async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const result = await postService.getAllPosts(parseInt(page, 10), parseInt(limit, 10));
        sendResponse(res, 200, 'Posts retrieved successfully', result);
    } catch (error) {
        next(error);
    }
};

export const getById = async (req, res, next) => {
    try {
        const post = await postService.getPostById(req.params.id);
        if (!post) {
            return sendResponse(res, 404, 'Post not found');
        }
        sendResponse(res, 200, 'Post retrieved successfully', post);
    } catch (error) {
        next(error);
    }
};

export const update = async (req, res, next) => {
    try {
        // Handle potential file upload for update as well, if applicable
        // For simplicity here, we are only updating text fields.
        // If you need to handle file updates, you'll need to adjust the middleware and controller logic.
        const postData = {
            ...req.body,
            createdBy: req.user.id // Ensure user is authenticated for updates if needed
        };
        const post = await postService.updatePostById(req.params.id, postData);
        if (!post) {
            return sendResponse(res, 404, 'Post not found');
        }
        sendResponse(res, 200, 'Post updated successfully', post);
    } catch (error) {
        next(error);
    }
};

export const softDelete = async (req, res, next) => {
    try {
        const post = await postService.softDeletePostById(req.params.id);
        if (!post) {
            return sendResponse(res, 404, 'Post not found');
        }
        // Optional: Delete from Cloudinary as well
        // if (post.imageUrls && post.imageUrls.length > 0) {
        //     // You'd need to extract public IDs from imageUrls or store them separately
        //     // Example: await cloudinary.uploader.destroy(public_id);
        // }
        sendResponse(res, 200, 'Post deleted successfully');
    } catch (error) {
        next(error);
    }
};
