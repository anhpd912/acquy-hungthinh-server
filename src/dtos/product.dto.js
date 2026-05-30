import Joi from 'joi';

export const createProductDto = Joi.object({
  tenSanPham: Joi.string().trim().required(),
  kyHieuMaSanPham: Joi.string().trim().required(),
  dienAp: Joi.string().trim().default('12V'),
  dungLuong: Joi.string().trim().required(),
  dongKhoiDong: Joi.string().trim().required(),
  kieuChanDeVaCocBinh: Joi.string().trim().required(),
  moTaUngDungVaTuongThich: Joi.string().trim().allow(null, ''),
  xuatXu: Joi.string().trim().default('Hàn Quốc'),
  kichThuocDaiMm: Joi.number().allow(null),
  kichThuocRongMm: Joi.number().allow(null),
  kichThuocCaoMm: Joi.number().allow(null),
  giaKhuyenNghiBan: Joi.number().allow(null),
  giaGara: Joi.number().allow(null),
  categoryId: Joi.string().uuid().required(),
});

export const updateProductDto = Joi.object({
  tenSanPham: Joi.string().trim().optional(),
  kyHieuMaSanPham: Joi.string().trim().optional(),
  dienAp: Joi.string().trim().optional(),
  dungLuong: Joi.string().trim().optional(),
  dongKhoiDong: Joi.string().trim().optional(),
  kieuChanDeVaCocBinh: Joi.string().trim().optional(),
  moTaUngDungVaTuongThich: Joi.string().trim().allow(null, ''),
  xuatXu: Joi.string().trim().optional(),
  kichThuocDaiMm: Joi.number().allow(null),
  kichThuocRongMm: Joi.number().allow(null),
  kichThuocCaoMm: Joi.number().allow(null),
  giaKhuyenNghiBan: Joi.number().allow(null),
  giaGara: Joi.number().allow(null),
  categoryId: Joi.string().uuid().optional(),
}).min(1);

export const queryProductDto = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  keyword: Joi.string().trim().allow(null, ''),
  categoryId: Joi.string().uuid().allow(null, ''),
});
