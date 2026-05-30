import * as categoryService from '../services/category.service.js';
import { sendResponse } from '../utils/responseHandler.js';

export const create = async (req, res, next) => {
    try {
        const category = await categoryService.createCategory(req.body);
        sendResponse(res, 201, 'Tạo loại ắc quy thành công', category);
    } catch (error) { next(error); }
};

export const getAll = async (req, res, next) => {
    try {
        const categories = await categoryService.getAllCategories();
        sendResponse(res, 200, 'Lấy danh sách thành công', categories);
    } catch (error) { next(error); }
};

export const getById = async (req, res, next) => {
    try {
        const category = await categoryService.getCategoryById(req.params.id);
        sendResponse(res, 200, 'Lấy thông tin thành công', category);
    } catch (error) { next(error); }
};

export const update = async (req, res, next) => {
    try {
        const category = await categoryService.updateCategory(req.params.id, req.body);
        sendResponse(res, 200, 'Cập nhật thành công', category);
    } catch (error) { next(error); }
};

export const remove = async (req, res, next) => {
    try {
        await categoryService.deleteCategory(req.params.id);
        sendResponse(res, 200, 'Xóa thành công');
    } catch (error) { next(error); }
};
