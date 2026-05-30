import express from 'express';
import * as videoController from '../controllers/video.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validation.middleware.js';
import { uploadToCloudinary } from '../middlewares/upload.middleware.js';
import { createVideoDto, updateVideoDto, queryVideoDto } from '../dtos/video.dto.js';

const router = express.Router();

/**
 * @swagger
 * /api/videos:
 *   post:
 *     summary: Create a new video
 *     tags:
 *       - Videos
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "My new video"
 *               media:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Video created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/', 
    authenticate, 
    uploadToCloudinary('media', 10), 
    validate(createVideoDto, 'body'), 
    videoController.create
);

/**
 * @swagger
 * /api/videos:
 *   get:
 *     summary: Get all videos
 *     tags:
 *       - Videos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: List of videos retrieved successfully
 */
router.get('/', authenticate, validate(queryVideoDto, 'query'), videoController.getAll);

/**
 * @swagger
 * /api/videos/{id}:
 *   get:
 *     summary: Get video by ID
 *     tags:
 *       - Videos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Video retrieved successfully
 *       404:
 *         description: Video not found
 */
router.get('/:id', authenticate, videoController.getById);

/**
 * @swagger
 * /api/videos/{id}:
 *   put:
 *     summary: Update video
 *     tags:
 *       - Videos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *     responses:
 *       200:
 *         description: Video updated successfully
 */
router.put('/:id', authenticate, validate(updateVideoDto, 'body'), videoController.update);

/**
 * @swagger
 * /api/videos/{id}:
 *   delete:
 *     summary: Soft delete video
 *     tags:
 *       - Videos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Video deleted successfully
 */
router.delete('/:id', authenticate, videoController.softDelete);

export default router;
