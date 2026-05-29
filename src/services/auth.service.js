import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma.js';

// Generate a new JWT access token
const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRATION || '15m',
  });
};

// Generate a new refresh token
const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRATION || '7d',
  });
};

// Hash a password before saving it to the database
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Compare a provided password with the stored hash
const comparePassword = async (providedPassword, storedPassword) => {
  return await bcrypt.compare(providedPassword, storedPassword);
};

// Verify a JWT and return the decoded payload
const verifyToken = (token, secret) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    return null;
  }
};

// Store a refresh token in the user's record
const saveRefreshToken = async (userId, token) => {
    const refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
    await prisma.user.update({
        where: { id: userId },
        data: { 
            refreshToken: token, 
            refreshTokenExpiry 
        }
    });
};


export {
  generateAccessToken,
  generateRefreshToken,
  hashPassword,
  comparePassword,
  verifyToken,
  saveRefreshToken,
};
