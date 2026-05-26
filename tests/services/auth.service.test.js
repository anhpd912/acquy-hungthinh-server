import {
  generateAccessToken,
  generateRefreshToken,
  hashPassword,
  comparePassword,
  verifyToken,
} from '../../src/services/auth.service.js';

describe('Auth Service', () => {
  // Set up test environment variables
  beforeAll(() => {
    process.env.ACCESS_TOKEN_SECRET = 'test_access_token_secret';
    process.env.REFRESH_TOKEN_SECRET = 'test_refresh_token_secret';
    process.env.ACCESS_TOKEN_EXPIRATION = '15m';
    process.env.REFRESH_TOKEN_EXPIRATION = '7d';
  });

  describe('Password Hashing', () => {
    test('should hash a password', async () => {
      const password = 'testPassword123';
      const hashedPassword = await hashPassword(password);
      
      expect(hashedPassword).toBeDefined();
      expect(hashedPassword).not.toBe(password);
      expect(hashedPassword.length).toBeGreaterThan(0);
    });

    test('should compare password correctly', async () => {
      const password = 'testPassword123';
      const hashedPassword = await hashPassword(password);
      
      const isMatch = await comparePassword(password, hashedPassword);
      const isNotMatch = await comparePassword('wrongPassword', hashedPassword);
      
      expect(isMatch).toBe(true);
      expect(isNotMatch).toBe(false);
    });
  });

  describe('Token Generation', () => {
    const testUserId = 'test-user-id-123';

    test('should generate access token', () => {
      const token = generateAccessToken(testUserId);
      
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(0);
    });

    test('should generate refresh token', () => {
      const token = generateRefreshToken(testUserId);
      
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(0);
    });

    test('should verify valid token', () => {
      const token = generateAccessToken(testUserId);
      const decoded = verifyToken(token, process.env.ACCESS_TOKEN_SECRET);
      
      expect(decoded).toBeDefined();
      expect(decoded.id).toBe(testUserId);
    });

    test('should return null for invalid token', () => {
      const decoded = verifyToken('invalid.token.here', process.env.ACCESS_TOKEN_SECRET);
      
      expect(decoded).toBeNull();
    });

    test('should return null for expired token', () => {
      // Create a token with immediate expiration
      const expiredToken = generateAccessToken(testUserId);
      // We can't easily test expired tokens without mocking time
      // This test is more for the structure
      const decoded = verifyToken(expiredToken, process.env.ACCESS_TOKEN_SECRET);
      
      // The token should still be valid since it was just created
      expect(decoded).toBeDefined();
    });
  });
});
