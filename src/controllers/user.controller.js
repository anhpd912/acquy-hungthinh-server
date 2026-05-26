import User from '../models/user.model.js';
import { sendResponse } from '../utils/responseHandler.js';
import { updateUserDto } from '../dtos/user.dto.js';

// Get current logged-in user's profile
export const getProfile = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user) {
            return sendResponse(res, 404, 'User not found');
        }
        const { password, ...userData } = user.toObject();
        sendResponse(res, 200, 'User profile retrieved successfully', userData);
    } catch (error) {
        next(error);
    }
};

// Update current logged-in user's profile
export const updateProfile = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { error, value } = updateUserDto.validate(req.body);
        if (error) {
            return sendResponse(res, 400, 'Validation error', { errors: error.details });
        }
        const { username, ...allowedUpdates } = value;
        const updatedUser = await User.findOneAndUpdate(
            { id: userId },
            { $set: allowedUpdates },
            { new: true, runValidators: true }
        );
        if (!updatedUser) {
            return sendResponse(res, 404, 'User not found');
        }
        const { password, ...responseData } = updatedUser.toObject();
        sendResponse(res, 200, 'User profile updated successfully', responseData);
    } catch (error) {
        next(error);
    }
};

// Soft delete current logged-in user (mark as inactive)
export const deleteProfile = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const updatedUser = await User.findOneAndUpdate(
            { id: userId },
            { $set: { isActive: false, lockedUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) } },
            { new: true }
        );
        if (!updatedUser) {
            return sendResponse(res, 404, 'User not found');
        }
        sendResponse(res, 200, 'User profile deactivated successfully');
    } catch (error) {
        next(error);
    }
};
