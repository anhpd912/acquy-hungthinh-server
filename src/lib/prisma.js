import { PrismaClient } from '@prisma/client';

// Khởi tạo client với cấu hình tối giản nhất cho Shared Hosting
const createPrismaClient = () => {
  return new PrismaClient({
    // 'minimal' giúp Prisma không sinh thêm cấu hình chuỗi lỗi phức tạp (giảm tải CPU)
    errorFormat: 'minimal', 
    // Chỉ giữ lại log 'error', tắt hoàn toàn log 'query' và 'info' để tiết kiệm I/O luồng
    log: ['error'], 
  });
};

const prisma = global.prisma || createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export default prisma;