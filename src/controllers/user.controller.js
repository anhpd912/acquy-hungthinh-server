import prisma from '../lib/prisma.js';
import { sendResponse } from '../utils/responseHandler.js';
import { updateUserDto } from '../dtos/user.dto.js';

export const getProfile = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user) {
            return sendResponse(res, 404, 'User not found');
        }
        // Prisma returns plain objects, so no need for .toObject()
        const { password, ...userData } = user;
        sendResponse(res, 200, 'User profile retrieved successfully', userData);
    } catch (error) {
        next(error);
    }
};

export const updateProfile = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { error, value } = updateUserDto.validate(req.body);
        if (error) {
            return sendResponse(res, 400, 'Validation error', { errors: error.details });
        }
        const { username, ...allowedUpdates } = value; // username is unique, so it's usually not updated directly here, but allowedUpdates can contain other fields
        
        // Fetch user first to check for username conflicts if username is part of allowedUpdates
        let existingUser = null;
        if (allowedUpdates.username && allowedUpdates.username !== req.user.username) {
            existingUser = await prisma.user.findUnique({ where: { username: allowedUpdates.username } });
            if (existingUser && existingUser.id !== userId) {
                return sendResponse(res, 409, 'Username already taken');
            }
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: allowedUpdates,
        });
        
        // No need to check if !updatedUser, as Prisma throws an error if the record is not found for update.
        const { password, ...responseData } = updatedUser;
        sendResponse(res, 200, 'User profile updated successfully', responseData);
    } catch (error) {
        next(error);
    }
};

export const deleteProfile = async (req, res, next) => {
    try {
        const userId = req.user.id;
        await prisma.user.update({
            where: { id: userId },
            data: { 
                isActive: false, 
                lockedUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) 
            },
        });
        sendResponse(res, 200, 'User profile deactivated successfully');
    } catch (error) {
        next(error);
    }
};
