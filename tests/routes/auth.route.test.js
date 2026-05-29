import request from 'supertest';
import app from '../../src/app.js';
import prisma from '../../src/lib/prisma.js';

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
      
      const user = await prisma.user.findUnique({ where: { username: testUser.username } });
      expect(user).toBeDefined();
      expect(user.displayName).toBe(testUser.displayName);
    });

    test('should reject duplicate username', async () => {
      await request(app).post('/api/auth/register').send(testUser);

      const response = await request(app)
        .post('/api/auth/register')
        .send(testUser)
        .expect(409);

      expect(response.body.code).toBe(409);
      expect(response.body.message).toBe('Username already taken');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await request(app).post('/api/auth/register').send(testUser);
    });

    test('should login successfully with correct credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ username: testUser.username, password: testUser.password })
        .expect(200);

      expect(response.body.code).toBe(200);
      expect(response.body.message).toBe('Login successful');
      expect(response.body.data.accessToken).toBeDefined();
    });

    test('should reject login with incorrect password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ username: testUser.username, password: 'wrongPassword' })
        .expect(401);

      expect(response.body.code).toBe(401);
      expect(response.body.message).toBe('Invalid credentials');
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
