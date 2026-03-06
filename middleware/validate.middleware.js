import { body, validationResult } from 'express-validator';

// Why middleware for validation?
// Frontend validation is just UX (user experience).
// Backend validation is actual security — anyone can bypass the browser and hit the API directly.

// Reusable helper — if validation fails, stop here and send errors back
// 'next' moves to the next function in the chain (the controller)
export const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // grab the first error message and send it back
        return res.status(422).json({ message: errors.array()[0].msg });
    }
    next(); // all good, move to controller
};

// Rules for POST /user/save (Register)
// Each body() call = one field, with chained rules
export const validateRegister = [
    body('name')
        .trim()
        .notEmpty().withMessage('Full name is required'),

    body('email')
        .trim()
        .isEmail().withMessage('Enter a valid email address'),

    body('password')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),

    body('mobile')
        .matches(/^\d{10}$/).withMessage('Mobile must be exactly 10 digits'),

    body('address')
        .trim()
        .notEmpty().withMessage('Address is required'),

    body('area')
        .trim()
        .notEmpty().withMessage('Please select your area'),

    // after all rules run, check if any failed
    handleValidationErrors,
];

// Rules for POST /user/login
// Simpler — just email format and password not empty
export const validateLogin = [
    body('email')
        .trim()
        .isEmail().withMessage('Enter a valid email address'),

    body('password')
        .notEmpty().withMessage('Password is required'),

    handleValidationErrors,
];
