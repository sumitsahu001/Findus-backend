import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';
import { successResponse, errorResponse } from '../utils/response.js';

// POST /user/save
// Creates a new user account. Hashes their password before saving to DB.
export const registerUser = async (req, res) => {
    try {
        const { name, email, password, mobile, address, city, area, gender } = req.body;

        // check if this email is already registered
        const existing = await User.findOne({ email });
        if (existing) {
            return errorResponse(res, 409, 'An account with this email already exists.');
        }

        // bcrypt.hash(plainText, saltRounds)
        // saltRounds=10 means bcrypt runs 2^10 = 1024 iterations — strong but not too slow
        // the result is a long string like "$2a$10$..." that you can't reverse-engineer
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            password: hashedPassword, // never the real one
            mobile,
            address,
            city: city || 'Indore',
            area,
            gender,
        });

        await user.save(); // persists to MongoDB

        return successResponse(res, 201, 'Account created! You can now login.');
    } catch (error) {
        console.error('registerUser error:', error.message);
        return errorResponse(res, 500, 'Something went wrong. Try again.');
    }
};

// POST /user/login
// Verifies credentials and returns a JWT token + user info
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // step 1: find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return errorResponse(res, 404, 'No account found with this email.');
        }

        // step 2: compare plain password with stored hash
        // bcrypt.compare does this safely — it doesn't decrypt, it re-hashes and compares
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return errorResponse(res, 401, 'Incorrect password. Try again.');
        }

        // step 3: create a JWT token
        // jwt.sign(payload, secret, options)
        // payload = data embedded in token (id + role here)
        // the frontend stores this and sends it on protected requests
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' } // token expires in 7 days
        );

        // frontend (AuthModals.jsx) expects exactly: { token, user: { name, role } }
        return res.status(200).json({
            token,
            user: {
                name: user.name,
                role: user.role,
            },
        });
    } catch (error) {
        console.error('loginUser error:', error.message);
        return errorResponse(res, 500, 'Something went wrong. Try again.');
    }
};
