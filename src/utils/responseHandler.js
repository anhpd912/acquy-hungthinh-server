export const sendResponse = (res, statusCode, message, data = null) => {
    res.status(statusCode).json({
        code: statusCode,
        message,
        data
    });
};