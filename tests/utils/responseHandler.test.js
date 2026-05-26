import { sendResponse } from '../../src/utils/responseHandler.js';

describe('Response Handler Utility', () => {
  let res;

  beforeEach(() => {
    // Mock Express res object
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  test('should format response correctly with data', () => {
    const statusCode = 200;
    const message = 'Success message';
    const data = { id: 1, name: 'Test' };

    sendResponse(res, statusCode, message, data);

    expect(res.status).toHaveBeenCalledWith(statusCode);
    expect(res.json).toHaveBeenCalledWith({
      code: statusCode,
      message,
      data,
    });
  });

  test('should format response correctly without data', () => {
    const statusCode = 404;
    const message = 'Not found message';

    sendResponse(res, statusCode, message);

    expect(res.status).toHaveBeenCalledWith(statusCode);
    expect(res.json).toHaveBeenCalledWith({
      code: statusCode,
      message,
      data: null,
    });
  });

  test('should format error response correctly', () => {
    const statusCode = 500;
    const message = 'Error message';
    const error = { stack: 'error stack' };

    sendResponse(res, statusCode, message, error);

    expect(res.status).toHaveBeenCalledWith(statusCode);
    expect(res.json).toHaveBeenCalledWith({
      code: statusCode,
      message,
      data: error,
    });
  });
});
