import Joi from 'joi';

// DTO for creating a video
export const createVideoDto = Joi.object({
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
    videoUrls: Joi.array()
        .items(Joi.string().uri())
        .optional()
        .messages({
            'array.base': 'Video URLs must be an array',
            'string.uri': 'Each video URL must be a valid URI'
        }),
    createdBy: Joi.string()
        .optional()
        .messages({
            'string.base': 'Created by must be a string'
        })
});

// DTO for updating a video
export const updateVideoDto = Joi.object({
    title: Joi.string()
        .min(1)
        .max(200)
        .optional()
        .messages({
            'string.base': 'Title must be a string',
            'string.min': 'Title cannot be empty',
            'string.max': 'Title must not exceed 200 characters'
        }),
    videoUrls: Joi.array()
        .items(Joi.string().uri())
        .optional()
        .messages({
            'array.base': 'Video URLs must be an array',
            'string.uri': 'Each video URL must be a valid URI'
        })
});

// DTO for query parameters (pagination)
export const queryVideoDto = Joi.object({
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
