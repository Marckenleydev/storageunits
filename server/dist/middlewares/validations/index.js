"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCreateBooking = exports.validateCreateStorageUnit = void 0;
// middlewares/validateStorageUnit.ts
const express_validator_1 = require("express-validator");
exports.validateCreateStorageUnit = [
    (0, express_validator_1.body)('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ max: 100 }).withMessage('Name must be at most 100 characters'),
    (0, express_validator_1.body)('size')
        .trim()
        .notEmpty().withMessage('Size is required'),
    (0, express_validator_1.body)('location')
        .trim()
        .notEmpty().withMessage('Location is required'),
    (0, express_validator_1.body)('pricePerDay')
        .notEmpty().withMessage('Price per day is required')
        .isFloat({ gt: 0 }).withMessage('Price per day must be a positive number'),
    (0, express_validator_1.body)('isAvailable')
        .optional()
        .isBoolean().withMessage('isAvailable must be a boolean'),
];
exports.validateCreateBooking = [
    (0, express_validator_1.body)('userName')
        .notEmpty().withMessage('userName is required'),
    (0, express_validator_1.body)('unitId')
        .notEmpty().withMessage('unitId is required'),
    (0, express_validator_1.body)('startDate')
        .notEmpty().withMessage('startDate is required')
        .isISO8601().withMessage('startDate must be a valid date'),
    (0, express_validator_1.body)('endDate')
        .notEmpty().withMessage('endDate is required')
        .isISO8601().withMessage('endDate must be a valid date'),
];
