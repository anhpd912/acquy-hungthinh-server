import Joi from 'joi';

// DTO for creating a product
export const createProductDto = Joi.object({
  tenSanPham: Joi.string().trim().required(),
  dongSanPham: Joi.string().trim().required(),
  kyHieuMaSanPham: Joi.string().trim().required(),
  dienAp: Joi.string().trim().default('12V'),
  dungLuong: Joi.string().trim().required(),
  dongKhoiDong: Joi.string().trim().required(),
  kieuChanDeVaCocBinh: Joi.string().trim().required(),
  moTaUngDungVaTuongThich: Joi.string().trim().allow(null, ''),
  xuatXu: Joi.string().trim().allow(null, ''),
  imageUrls: Joi.array().items(Joi.string().uri()).optional(),
  imagePublicIds: Joi.array().items(Joi.string()).optional(),
  kichThuocDaiMm: Joi.number().allow(null),
  kichThuocRongMm: Joi.number().allow(null),
  kichThuocCaoMm: Joi.number().allow(null),
  giaKhuyenNghiBan: Joi.number().allow(null),
  giaGara: Joi.number().allow(null),
});

// DTO for updating a product
export const updateProductDto = Joi.object({
  tenSanPham: Joi.string().trim().optional(),
  dongSanPham: Joi.string().trim().optional(),
  kyHieuMaSanPham: Joi.string().trim().optional(),
  dienAp: Joi.string().trim().optional(),
  dungLuong: Joi.string().trim().optional(),
  dongKhoiDong: Joi.string().trim().optional(),
  kieuChanDeVaCocBinh: Joi.string().trim().optional(),
  moTaUngDungVaTuongThich: Joi.string().trim().allow(null, '').optional(),
  xuatXu: Joi.string().trim().allow(null, '').optional(),
  imageUrls: Joi.array().items(Joi.string().uri()).optional(),
  imagePublicIds: Joi.array().items(Joi.string()).optional(),
  kichThuocDaiMm: Joi.number().allow(null).optional(),
  kichThuocRongMm: Joi.number().allow(null).optional(),
  kichThuocCaoMm: Joi.number().allow(null).optional(),
  giaKhuyenNghiBan: Joi.number().allow(null).optional(),
  giaGara: Joi.number().allow(null).optional(),
}).min(1);

// DTO for query parameters
export const queryProductDto = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  search: Joi.string().trim().allow(null, ''),
  dongSanPham: Joi.string().trim().allow(null, ''),
});
