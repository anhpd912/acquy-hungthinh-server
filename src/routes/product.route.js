import express from 'express';
import * as productController from '../controllers/product.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validation.middleware.js';
import { createProductDto, updateProductDto, queryProductDto } from '../dtos/product.dto.js';
import { upload, uploadToCloudinary } from '../middlewares/upload.middleware.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         tenSanPham:
 *           type: string
 *         dongSanPham:
 *           type: string
 *         kyHieuMaSanPham:
 *           type: string
 *         dienAp:
 *           type: string
 *         dungLuong:
 *           type: string
 *         dongKhoiDong:
 *           type: string
 *         kieuChanDeVaCocBinh:
 *           type: string
 *         moTaUngDungVaTuongThich:
 *           type: string
 *         xuatXu:
 *           type: string
 *         imageUrls:
 *           type: array
 *           items:
 *             type: string
 *         kichThuocDaiMm:
 *           type: number
 *         kichThuocRongMm:
 *           type: number
 *         kichThuocCaoMm:
 *           type: number
 *         giaKhuyenNghiBan:
 *           type: number
 *         giaGara:
 *           type: number
 *         categoryId:
 *           type: string
 *         category:
 *           $ref: '#/components/schemas/Category'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Quản lý sản phẩm (Ắc quy)
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Lấy danh sách sản phẩm với bộ lọc và phân trang
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Số trang
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Số lượng sản phẩm trên mỗi trang
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: Tìm kiếm theo tên, mã hoặc dòng sản phẩm
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: string
 *         description: Lọc theo ID loại ắc quy
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     products:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Product'
 *                     totalPages:
 *                       type: integer
 *                     currentPage:
 *                       type: integer
 *                     totalProducts:
 *                       type: integer
 *   post:
 *     summary: Tạo sản phẩm mới (Yêu cầu Admin)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               tenSanPham:
 *                 type: string
 *               kyHieuMaSanPham:
 *                 type: string
 *               dienAp:
 *                 type: string
 *                 default: '12V'
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
 *                 default: 'Hàn Quốc'
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
 *               categoryId:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Sản phẩm đã được tạo thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 */

router.get('/', validate(queryProductDto, 'query'), productController.getAll);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Lấy chi tiết sản phẩm theo ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của sản phẩm
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Không tìm thấy sản phẩm
 *   put:
 *     summary: Cập nhật sản phẩm (Yêu cầu Admin)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của sản phẩm cần cập nhật
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
 *               categoryId:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Cập nhật sản phẩm thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Không tìm thấy sản phẩm
 *   delete:
 *     summary: Xóa sản phẩm (Yêu cầu Admin)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của sản phẩm cần xóa
 *     responses:
 *       200:
 *         description: Xóa sản phẩm thành công
 *       404:
 *         description: Không tìm thấy sản phẩm
 */

router.post('/', authenticate, uploadToCloudinary('images', 5), validate(createProductDto, 'body'), productController.create);
router.get('/:id', productController.getById);
router.put('/:id', authenticate, uploadToCloudinary('images', 5), validate(updateProductDto, 'body'), productController.update);
router.delete('/:id', authenticate, productController.remove);

export default router;
