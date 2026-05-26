import { registerUserDto, loginUserDto, updateUserDto } from '../../src/dtos/user.dto.js';

describe('User DTO Validation', () => {
  describe('registerUserDto', () => {
    test('should validate valid registration data', () => {
      const validData = {
        username: 'john_doe',
        password: 'password123',
        displayName: 'John Doe',
      };

      const { error, value } = registerUserDto.validate(validData);
      
      expect(error).toBeUndefined();
      expect(value).toBeDefined();
      expect(value.username).toBe('john_doe');
    });

    test('should reject username less than 5 characters', () => {
      const invalidData = {
        username: 'joh',
        password: 'password123',
        displayName: 'John Doe',
      };

      const { error } = registerUserDto.validate(invalidData);
      
      expect(error).toBeDefined();
      expect(error.message).toContain('username');
    });

    test('should reject password less than 6 characters', () => {
      const invalidData = {
        username: 'john_doe',
        password: 'short',
        displayName: 'John Doe',
      };

      const { error } = registerUserDto.validate(invalidData);
      
      expect(error).toBeDefined();
      expect(error.message).toContain('password');
    });

    test('should reject missing required fields', () => {
      const invalidData = {
        username: 'john_doe',
        // password and displayName are missing
      };

      const { error } = registerUserDto.validate(invalidData);
      
      expect(error).toBeDefined();
      expect(error.message).toContain('password');
    });
  });

  describe('loginUserDto', () => {
    test('should validate valid login data', () => {
      const validData = {
        username: 'john_doe',
        password: 'password123',
      };

      const { error, value } = loginUserDto.validate(validData);
      
      expect(error).toBeUndefined();
      expect(value).toBeDefined();
    });

    test('should reject missing username', () => {
      const invalidData = {
        password: 'password123',
      };

      const { error } = loginUserDto.validate(invalidData);
      
      expect(error).toBeDefined();
      expect(error.message).toContain('username');
    });

    test('should reject missing password', () => {
      const invalidData = {
        username: 'john_doe',
      };

      const { error } = loginUserDto.validate(invalidData);
      
      expect(error).toBeDefined();
      expect(error.message).toContain('password');
    });
  });

  describe('updateUserDto', () => {
    test('should validate valid update data', () => {
      const validData = {
        displayName: 'John Doe Updated',
        isActive: true,
      };

      const { error, value } = updateUserDto.validate(validData);
      
      expect(error).toBeUndefined();
      expect(value).toBeDefined();
    });

    test('should allow empty object (all fields optional)', () => {
      const validData = {};

      const { error, value } = updateUserDto.validate(validData);
      
      expect(error).toBeUndefined();
      expect(value).toBeDefined();
    });

    test('should reject displayName less than 3 characters', () => {
      const invalidData = {
        displayName: 'Jo',
      };

      const { error } = updateUserDto.validate(invalidData);
      
      expect(error).toBeDefined();
      expect(error.message).toContain('displayName');
    });
  });
});
