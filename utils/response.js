// Standard JSON shapes I send back from every route
// Keeps API responses consistent — frontend always knows what to expect

// For success: { success: true, message, data }
export const successResponse = (res, statusCode, message, data = {}) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
    });
};

// For errors: { success: false, message }
// 'data' is excluded — no point sending empty object on error
export const errorResponse = (res, statusCode, message) => {
    return res.status(statusCode).json({
        success: false,
        message,
    });
};
