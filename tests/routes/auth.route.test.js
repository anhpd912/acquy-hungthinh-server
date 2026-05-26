import request from 'supertest';
import app from '../../src/app.js';
import User from '../../src/models/user.model.js';

describe('Authentication Endpoints', () => {
  const testUser = {
    username: 'testuser',
    password: 'testPassword123',
    displayName: 'Test User',
  };

  describe('POST /api/auth/register', () => {
    test('should register a new user successfully', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send(testUser)
        .expect(201);

      expect(response.body.code).toBe(201);
      expect(response.body.message).toBe('User registered successfully');
      expect(response.body.data).toBeDefined();

      // Verify user was created in database
      const user = await User.findOne({ username: testUser.username });
      expect(user).toBeDefined();
      expect(user.displayName).toBe(testUser.displayName);
    });

    test('should reject duplicate username', async () => {
      // First registration
      await request(app)
        .post('/api/auth/register')
        .send(testUser);

      // Second registration with same username
      const response = await request(app)
        .post('/api/auth/register')
        .send(testUser)
        .expect(409);

      expect(response.body.code).toBe(409);
      expect(response.body.message).toBe('Username already taken');
    });

    test('should reject invalid registration data', async () => {
      const invalidData = {
        username: 'short', // Too short
        password: 'pass', // Too short
        displayName: 'Test',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(invalidData)
        .expect(400);

      expect(response.body.code).toBe(400);
      expect(response.body.message).toContain('Validation error');
    });

    test('should reject missing required fields', async () => {
      const incompleteData = {
        username: 'testuser2',
        // password and displayName missing
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(incompleteData)
        .expect(400);

      expect(response.body.code).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Create a user before each login test
      await request(app)
        .post('/api/auth/register')
        .send(testUser);
    });

    test('should login successfully with correct credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: testUser.username,
          password: testUser.password,
        })
        .expect(200);

      expect(response.body.code).toBe(200);
      expect(response.body.message).toBe('Login successful');
      expect(response.body.data).toBeDefined();
      expect(response.body.data.accessToken).toBeDefined();
      expect(typeof response.body.data.accessToken).toBe('string');
    });

    test('should reject login with incorrect password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: testUser.username,
          password: 'wrongPassword',
        })
        .expect(401);

      expect(response.body.code).toBe(401);
      expect(response.body.message).toBe('Invalid credentials');
    });

    test('should reject login with non-existent user', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'nonexistent',
          password: 'password123',
        })
        .expect(401);

      expect(response.body.code).toBe(401);
      expect(response.body.message).toBe('Invalid credentials or user disabled');
    });

    test('should reject login with missing credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: testUser.username,
          // password missing
        })
        .expect(400);

      expect(response.body.code).toBe(400);
      expect(response.body.message).toContain('Validation error');
    });
  });

  describe('POST /api/auth/logout', () => {
    test('should logout successfully', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .expect(200);

      expect(response.body.code).toBe(200);
      expect(response.body.message).toBe('Logged out successfully');
    });
  });

  describe('POST /api/auth/refresh', () => {
    test('should reject refresh without token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .expect(401);

      expect(response.body.code).toBe(401);
      expect(response.body.message).toBe('No refresh token provided');
    });
  });
});
