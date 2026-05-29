import { verifyToken } from '../services/auth.service.js';
import prisma from '../lib/prisma.js';
import { sendResponse } from '../utils/responseHandler.js';

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendResponse(res, 401, 'No token provided');
    }

    const token = authHeader.split(' ')[1];
    
    const decoded = verifyToken(token, process.env.ACCESS_TOKEN_SECRET);
    
    if (!decoded) {
      return sendResponse(res, 401, 'Invalid or expired token');
    }

    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    
    if (!user || !user.isActive) {
      return sendResponse(res, 401, 'User not found or inactive');
    }

    req.user = user;
    next();
  } catch (error) {
    return sendResponse(res, 401, 'Authentication failed', { error: error.message });
  }
};

export { authenticate };
