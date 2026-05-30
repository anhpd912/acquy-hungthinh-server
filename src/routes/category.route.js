import express from 'express';
import * as categoryController from '../controllers/category.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: string
 *           description: ID tự động tạo
 *         name:
 *           type: string
 *           description: Tên loại ắc quy
 *         description:
 *           type: string
 *           description: Mô tả chi tiết
 *       example:
 *         name: Ắc quy ô tô
 *         description: Các dòng ắc quy chuyên dụng cho xe hơi và xe tải nhẹ
 */

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Quản lý loại ắc quy
 */

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Lấy danh sách tất cả loại ắc quy
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Thành công
 *   post:
 *     summary: Tạo loại ắc quy mới (Yêu cầu Admin)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       201:
 *         description: Tạo thành công
 */

router.get('/', categoryController.getAll);

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Lấy chi tiết loại ắc quy theo ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thành công
 *   put:
 *     summary: Cập nhật thông tin loại ắc quy (Yêu cầu Admin)
 *     tags: [Categories]
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
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *   delete:
 *     summary: Xóa loại ắc quy (Yêu cầu Admin)
 *     tags: [Categories]
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
 *         description: Xóa thành công
 */

router.get('/:id', categoryController.getById);

router.use(authenticate);
router.post('/', categoryController.create);
router.put('/:id', categoryController.update);
router.delete('/:id', categoryController.remove);

export default router;
