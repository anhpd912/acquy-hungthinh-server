import { verifyToken } from '../services/auth.service.js';
import User from '../models/user.model.js';
import { sendResponse } from '../utils/responseHandler.js';

const authenticate = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendResponse(res, 401, 'No token provided');
    }

    const token = authHeader.split(' ')[1];
    
    // Verify the token
    const decoded = verifyToken(token, process.env.ACCESS_TOKEN_SECRET);
    
    if (!decoded) {
      return sendResponse(res, 401, 'Invalid or expired token');
    }

    // Find the user
    const user = await User.findOne({ id: decoded.id });
    
    if (!user || !user.isActive) {
      return sendResponse(res, 401, 'User not found or inactive');
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    return sendResponse(res, 401, 'Authentication failed', { error: error.message });
  }
};

export { authenticate };
