import jwt from 'jsonwebtoken';
import { errorResponse } from '../utils/response.js';

// This will protect routes that need a logged-in user
// Runs BEFORE the controller — if token is bad, the controller never runs

// How JWT auth works:
// 1. User logs in → server gives them a signed token
// 2. User sends that token in every future request (Authorization header)
// 3. This middleware verifies the signature to confirm token is real and not expired

const verifyToken = (req, res, next) => {
    // Token comes in header as: Authorization: Bearer <token>
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // grab the part after "Bearer "

    if (!token) {
        return errorResponse(res, 401, 'Access denied. No token provided.');
    }

    try {
        // jwt.verify throws an error if token is invalid or expired
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // attach user info to request so controllers can use it
        next();
    } catch (error) {
        return errorResponse(res, 403, 'Invalid or expired token.');
    }
};

export default verifyToken;
