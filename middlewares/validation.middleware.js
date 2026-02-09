const Joi = require('joi');
const logger = require('../utils/log');

const validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });

        if (error) {
            const errorMessage = error.details.map((detail) => detail.message).join(', ');
            logger.warn(`Validation error: ${errorMessage}`);
            return res.status(400).json({
                success: false,
                message: errorMessage,
            });
        }

        next();
    };
};

const schemas = {
    register: Joi.object({
        email: Joi.string().email().required().messages({
            'string.email': 'Please provide a valid email',
            'any.required': 'Email is required',
        }),
        password: Joi.string().min(6).required().messages({
            'string.min': 'Password must be at least 6 characters long',
            'any.required': 'Password is required',
        }),
        name: Joi.string().required().messages({
            'any.required': 'Name is required',
        }),
        role: Joi.string().valid('USER', 'admin', 'SELLER').default('USER'),
    }),
    login: Joi.object({
        email: Joi.string().email().required().messages({
            'string.email': 'Please provide a valid email',
            'any.required': 'Email is required',
        }),
        password: Joi.string().required().messages({
            'any.required': 'Password is required',
        }),
    }),
    updateProfile: Joi.object({
        email: Joi.string().email().optional(),
        name: Joi.string().optional(),
    }).min(1)
};

module.exports = { validate, schemas };
