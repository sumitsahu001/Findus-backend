import { errorResponse } from '../utils/response.js';

/**
 * Global Error Middleware
 * Author: Sumit Sahu (Production Standard)
 * 
 * Why: This is the final safety net for our entire API.
 * Any error thrown in any route (database, validation, crashing) lands here.
 * It ensures the client ALWAYS gets a professional JSON response with a clear message.
 */
const errorMiddleware = (err, req, res, next) => {
    // 1. Log the error for internal debugging (with stack trace in development)
    console.error(`[SERVER ERROR]: ${err.message}`);
    if (process.env.NODE_ENV !== 'production') {
        console.error(err.stack);
    }

    // 2. Determine StatusCode & Message
    // If it's a Mongoose validation error, Mongo duplicate key error, etc.
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';

    // Special Case: Mongoose Bad ObjectID (404)
    if (err.name === 'CastError') {
        statusCode = 404;
        message = 'Resource not found with the provided ID.';
    }

    // Special Case: Mongoose Validation (400)
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = Object.values(err.errors).map(val => val.message).join(', ');
    }

    // 3. Send standardized response
    return errorResponse(res, statusCode, message);
};

export default errorMiddleware;
