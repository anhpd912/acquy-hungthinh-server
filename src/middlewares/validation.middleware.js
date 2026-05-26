import { sendResponse } from '../utils/responseHandler.js';

// Validation middleware generator
export const validate = (schema, source = 'body') => {
    return (req, res, next) => {
        const dataToValidate = source === 'body' ? req.body : source === 'query' ? req.query : source === 'params' ? req.params : null;
        
        const { error, value } = schema.validate(dataToValidate, { abortEarly: false, stripUnknown: true });
        
        if (error) {
            const errorMessage = error.details.map(detail => detail.message).join(', ');
            return sendResponse(res, 400, 'Validation error', { errors: error.details });
        }
        
        // Handle validated and sanitized data
        if (source === 'body') {
            req.body = value;
        } else if (source === 'query') {
            // In Express, req.query is a getter. We must clear it and assign new properties 
            // to avoid the "Cannot set property query" error.
            for (const key in req.query) {
                delete req.query[key];
            }
            Object.assign(req.query, value);
        } else if (source === 'params') {
            // Same approach for params just to be safe
            for (const key in req.params) {
                delete req.params[key];
            }
            Object.assign(req.params, value);
        }
        
        next();
    };
};

export default { validate };

