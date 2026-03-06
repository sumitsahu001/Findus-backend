/**
 * Async Handler Utility
 * Author: Sumit Sahu (Self-Coded)
 * 
 * Why: Writing try-catch in every controller makes the code "dirty" and repetitive.
 * This Higher-Order Function (HOF) wraps our async routes. 
 * If an error occurs, it automatically passes it to the next(error) middleware.
 * 
 * How to use: export const myControler = asyncHandler(async (req, res) => { ... })
 */
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
