import Joi from 'joi';

// DTO for creating a post
export const createPostDto = Joi.object({
    title: Joi.string()
        .min(1)
        .max(200)
        .required()
        .messages({
            'string.base': 'Title must be a string',
            'string.min': 'Title cannot be empty',
            'string.max': 'Title must not exceed 200 characters',
            'any.required': 'Title is required'
        }),
    imageUrls: Joi.array()
        .items(Joi.string().uri())
        .optional()
        .messages({
            'array.base': 'Image URLs must be an array',
            'string.uri': 'Each image URL must be a valid URI'
        }),
    createdBy: Joi.string()
        .optional()
        .messages({
            'string.base': 'Created by must be a string'
        })
});

// DTO for updating a post
export const updatePostDto = Joi.object({
    title: Joi.string()
        .min(1)
        .max(200)
        .optional()
        .messages({
            'string.base': 'Title must be a string',
            'string.min': 'Title cannot be empty',
            'string.max': 'Title must not exceed 200 characters'
        }),
    imageUrls: Joi.array()
        .items(Joi.string().uri())
        .optional()
        .messages({
            'array.base': 'Image URLs must be an array',
            'string.uri': 'Each image URL must be a valid URI'
        })
});

// DTO for query parameters (pagination)
export const queryPostDto = Joi.object({
    page: Joi.number()
        .integer()
        .min(1)
        .optional()
        .default(1)
        .messages({
            'number.base': 'Page must be a number',
            'number.integer': 'Page must be an integer',
            'number.min': 'Page must be at least 1'
        }),
    limit: Joi.number()
        .integer()
        .min(1)
        .max(100)
        .optional()
        .default(10)
        .messages({
            'number.base': 'Limit must be a number',
            'number.integer': 'Limit must be an integer',
            'number.min': 'Limit must be at least 1',
            'number.max': 'Limit must not exceed 100'
        })
});
