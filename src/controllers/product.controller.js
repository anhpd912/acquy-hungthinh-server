import * as productService from '../services/product.service.js';
import { sendResponse } from '../utils/responseHandler.js';
import { ApiError } from '../utils/ApiError.js';

export const create = async (req, res, next) => {
    try {
        const productData = {
            ...req.body,
            imageUrls: req.cloudinaryUrls || [],
            imagePublicIds: req.cloudinaryPublicIds || []
        };
        const product = await productService.createProduct(productData);
        sendResponse(res, 201, 'Sản phẩm đã được tạo thành công', product);
    } catch (error) { next(error); }
};

export const getAll = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, search, keyword, categoryId, dongSanPham } = req.query;
        const filters = { search, keyword, categoryId };
        const options = { page: parseInt(page, 10), limit: parseInt(limit, 10) };
        const result = await productService.getAllProducts(filters, options);
        sendResponse(res, 200, 'Lấy danh sách sản phẩm thành công', result);
    } catch (error) { next(error); }
};

export const getById = async (req, res, next) => {
    try {
        const product = await productService.getProductById(req.params.id);
        if (!product) throw new ApiError(404, 'Không tìm thấy sản phẩm');
        sendResponse(res, 200, 'Lấy thông tin sản phẩm thành công', product);
    } catch (error) { next(error); }
};

export const update = async (req, res, next) => {
    try {
        const productData = { ...req.body };
        if (req.cloudinaryUrls && req.cloudinaryUrls.length > 0) {
            productData.imageUrls = req.cloudinaryUrls;
            productData.imagePublicIds = req.cloudinaryPublicIds;
        }
        const product = await productService.updateProductById(req.params.id, productData);
        sendResponse(res, 200, 'Cập nhật sản phẩm thành công', product);
    } catch (error) { next(error); }
};

export const remove = async (req, res, next) => {
    try {
        await productService.deleteProductById(req.params.id);
        sendResponse(res, 200, 'Xóa sản phẩm thành công');
    } catch (error) { next(error); }
};
