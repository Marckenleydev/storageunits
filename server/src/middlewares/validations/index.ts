// middlewares/validateStorageUnit.ts
import { body } from 'express-validator';

export const validateCreateStorageUnit = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ max: 100 }).withMessage('Name must be at most 100 characters'),

  body('size')
    .trim()
    .notEmpty().withMessage('Size is required'),

  body('location')
    .trim()
    .notEmpty().withMessage('Location is required'),

  body('pricePerDay')
    .notEmpty().withMessage('Price per day is required')
    .isFloat({ gt: 0 }).withMessage('Price per day must be a positive number'),

  body('isAvailable')
    .optional()
    .isBoolean().withMessage('isAvailable must be a boolean'),
];



export const validateCreateBooking = [
  body('userName')
    .notEmpty().withMessage('userName is required'),

  body('unitId')
    .notEmpty().withMessage('unitId is required'),

  body('startDate')
    .notEmpty().withMessage('startDate is required')
    .isISO8601().withMessage('startDate must be a valid date'),

  body('endDate')
    .notEmpty().withMessage('endDate is required')
    .isISO8601().withMessage('endDate must be a valid date'),
];
