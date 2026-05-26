import Joi from 'joi';

// DTO for user registration
export const registerUserDto = Joi.object({
    username: Joi.string()
        .alphanum()
        .min(5)
        .max(20)
        .required()
        .messages({
            'string.base': 'Username must be a string',
            'string.alphanum': 'Username must only contain alphanumeric characters',
            'string.min': 'Username must be at least 5 characters long',
            'string.max': 'Username must not exceed 20 characters',
            'any.required': 'Username is required'
        }),
    password: Joi.string()
        .min(6)
        .required()
        .messages({
            'string.base': 'Password must be a string',
            'string.min': 'Password must be at least 6 characters long',
            'any.required': 'Password is required'
        }),
    displayName: Joi.string()
        .min(3)
        .max(50)
        .required()
        .messages({
            'string.base': 'Display name must be a string',
            'string.min': 'Display name must be at least 3 characters long',
            'string.max': 'Display name must not exceed 50 characters',
            'any.required': 'Display name is required'
        })
});

// DTO for user login
export const loginUserDto = Joi.object({
    username: Joi.string()
        .required()
        .messages({
            'string.base': 'Username must be a string',
            'any.required': 'Username is required'
        }),
    password: Joi.string()
        .required()
        .messages({
            'string.base': 'Password must be a string',
            'any.required': 'Password is required'
        })
});

// DTO for updating user
export const updateUserDto = Joi.object({
    displayName: Joi.string()
        .min(3)
        .max(50)
        .optional()
        .messages({
            'string.base': 'Display name must be a string',
            'string.min': 'Display name must be at least 3 characters long',
            'string.max': 'Display name must not exceed 50 characters'
        }),
    isActive: Joi.boolean()
        .optional()
        .messages({
            'boolean.base': 'isActive must be a boolean'
        })
});
