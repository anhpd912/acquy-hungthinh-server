import { Router } from 'express';
import * as productController from '../controllers/product.controller.js';
import { validate } from '../middlewares/validation.middleware.js';
import { uploadToCloudinary } from '../middlewares/upload.middleware.js';
import { createProductDto, updateProductDto, queryProductDto } from '../dtos/product.dto.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management and retrieval
 */

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product with image uploads
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               tenSanPham:
 *                 type: string
 *               dongSanPham:
 *                 type: string
 *               kyHieuMaSanPham:
 *                 type: string
 *               dienAp:
 *                 type: string
 *               dungLuong:
 *                 type: string
 *               dongKhoiDong:
 *                 type: string
 *               kieuChanDeVaCocBinh:
 *                 type: string
 *               moTaUngDungVaTuongThich:
 *                 type: string
 *               xuatXu:
 *                 type: string
 *               kichThuocDaiMm:
 *                 type: number
 *               kichThuocRongMm:
 *                 type: number
 *               kichThuocCaoMm:
 *                 type: number
 *               giaKhuyenNghiBan:
 *                 type: number
 *               giaGara:
 *                 type: number
 *               media:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Validation error
 */
router
    .route('/')
    .post(uploadToCloudinary, validate(createProductDto), productController.create)
    /**
     * @swagger
     * /api/products:
     *   get:
     *     summary: Get all products with pagination and filtering
     *     tags: [Products]
     *     parameters:
     *       - in: query
     *         name: page
     *         schema:
     *           type: integer
     *       - in: query
     *         name: limit
     *         schema:
     *           type: integer
     *       - in: query
     *         name: search
     *         schema:
     *           type: string
     *       - in: query
     *         name: dongSanPham
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: A list of products
     */
    .get(validate(queryProductDto, 'query'), productController.getAll);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product data
 *       404:
 *         description: Product not found
 *   patch:
 *     summary: Update a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               tenSanPham:
 *                 type: string
 *               dongSanPham:
 *                 type: string
 *               media:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       404:
 *         description: Product not found
 *   delete:
 *     summary: Soft delete a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 */
router
    .route('/:id')
    .get(productController.getById)
    .patch(uploadToCloudinary, validate(updateProductDto), productController.update)
    .delete(productController.remove);

export default router;
