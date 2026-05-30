import express from 'express';
import * as postController from '../controllers/post.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validation.middleware.js';
import { uploadToCloudinary } from '../middlewares/upload.middleware.js';
import { createPostDto, updatePostDto, queryPostDto } from '../dtos/post.dto.js';

const router = express.Router();

/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: Create a new post
 *     tags:
 *       - Posts
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
 *                 example: "My new post"
 *               media:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Post created successfully
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
    validate(createPostDto, 'body'), 
    postController.create
);

/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Get all posts
 *     tags:
 *       - Posts
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
 *         description: List of posts retrieved successfully
 */
router.get('/', authenticate, validate(queryPostDto, 'query'), postController.getAll);

/**
 * @swagger
 * /api/posts/{id}:
 *   get:
 *     summary: Get post by ID
 *     tags:
 *       - Posts
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
 *         description: Post retrieved successfully
 *       404:
 *         description: Post not found
 */
router.get('/:id', authenticate, postController.getById);

/**
 * @swagger
 * /api/posts/{id}:
 *   put:
 *     summary: Update post
 *     tags:
 *       - Posts
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
 *         description: Post updated successfully
 */
router.put('/:id', authenticate, validate(updatePostDto, 'body'), postController.update);

/**
 * @swagger
 * /api/posts/{id}:
 *   delete:
 *     summary: Soft delete post
 *     tags:
 *       - Posts
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
 *         description: Post deleted successfully
 */
router.delete('/:id', authenticate, postController.softDelete);

export default router;
