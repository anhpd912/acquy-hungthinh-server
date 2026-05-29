import { ApiError } from './ApiError.js';

export const validate = (schema, source = 'body') => (req, res, next) => {
    const { error, value } = schema.validate(req[source], {
        abortEarly: false,
        stripUnknown: true,
    });

    if (error) {
        const errors = error.details.map((detail) => ({
            message: detail.message,
            path: detail.path,
        }));
        return next(new ApiError(400, 'Validation failed', errors));
    }

    req[source] = value; // Attach validated and sanitized data to the request
    next();
};
