import User from '../models/user.model.js';
import {
  generateAccessToken,
  generateRefreshToken,
  hashPassword,
  comparePassword,
  saveRefreshToken,
  verifyToken,
} from '../services/auth.service.js';
import { sendResponse } from '../utils/responseHandler.js';

const register = async (req, res) => {
  const { username, password, displayName } = req.body;

  if (!username || !password || !displayName) {
    return sendResponse(res, 400, 'All fields are required');
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return sendResponse(res, 409, 'Username already taken');
    }

    const hashedPassword = await hashPassword(password);
    const user = new User({
      username,
      password: hashedPassword,
      displayName,
    });

    await user.save();

    sendResponse(res, 201, 'User registered successfully');
  } catch (error) {
    sendResponse(res, 500, 'Server error', { error: error.message });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return sendResponse(res, 400, 'Username and password are required');
  }

  try {
    const user = await User.findOne({ username });
    if (!user || !user.isActive) {
      return sendResponse(res, 401, 'Invalid credentials or user disabled');
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return sendResponse(res, 401, 'Invalid credentials');
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    await saveRefreshToken(user.id, refreshToken);
    
    // For security, the refresh token should be sent in an HTTP-Only cookie
    res.cookie('refreshToken', refreshToken, { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    sendResponse(res, 200, 'Login successful', { accessToken });
  } catch (error) {
    sendResponse(res, 500, 'Server error', { error: error.message });
  }
};

const refreshToken = async (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    return sendResponse(res, 401, 'No refresh token provided');
  }

  try {
    // Verify the refresh token
    const decoded = verifyToken(token, process.env.REFRESH_TOKEN_SECRET);
    
    if (!decoded) {
      return sendResponse(res, 401, 'Invalid or expired refresh token');
    }

    // Find the user and check if the refresh token matches
    const user = await User.findOne({ id: decoded.id });
    
    if (!user || !user.isActive || user.refreshToken !== token) {
      return sendResponse(res, 401, 'Invalid refresh token');
    }

    // Check if refresh token is expired
    if (user.refreshTokenExpiry && new Date() > user.refreshTokenExpiry) {
      return sendResponse(res, 401, 'Refresh token expired');
    }

    // Generate new access token
    const newAccessToken = generateAccessToken(user.id);
    
    sendResponse(res, 200, 'Token refreshed successfully', { accessToken: newAccessToken });
  } catch (error) {
    sendResponse(res, 500, 'Server error', { error: error.message });
  }
};

const logout = async (req, res) => {
  const token = req.cookies.refreshToken;

  if (token) {
    try {
      // Clear the refresh token from the user's record
      const decoded = verifyToken(token, process.env.REFRESH_TOKEN_SECRET);
      if (decoded) {
        await User.findOneAndUpdate(
          { id: decoded.id },
          { refreshToken: null, refreshTokenExpiry: null }
        );
      }
    } catch (error) {
      // Continue with logout even if token verification fails
    }
  }

  // Clear the refresh token cookie
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });

  sendResponse(res, 200, 'Logged out successfully');
};

export { register, login, refreshToken, logout };
