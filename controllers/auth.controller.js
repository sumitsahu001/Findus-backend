import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';
import { successResponse } from '../utils/response.js';
import asyncHandler from '../utils/asyncHandler.js';

// POST /user/save
// Creates a new user account. Hashes their password before saving to DB.
// Wrapped in asyncHandler to automatically catch errors and pass to errorMiddleware.
export const registerUser = asyncHandler(async (req, res) => {
    const {
        name, email, password, mobile, address, city, area, gender, role,
        occupation, annualIncome, familySize, bio // CV fields
    } = req.body;

    // check if this email is already registered
    const existing = await User.findOne({ email });
    if (existing) {
        const error = new Error('An account with this email already exists.');
        error.statusCode = 409;
        throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
        name,
        email,
        password: hashedPassword,
        mobile,
        address,
        city: city || 'Indore',
        area,
        gender,
        role,
        occupation,
        annualIncome,
        familySize,
        bio
    });

    await user.save();

    return successResponse(res, 201, 'Account created! You can now login.');
});

// POST /user/login
// Verifies credentials and returns a JWT token + user info
export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // step 1: find user by email
    const user = await User.findOne({ email });
    if (!user) {
        const error = new Error('No account found with this email.');
        error.statusCode = 404;
        throw error;
    }

    // step 2: compare plain password with stored hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        const error = new Error('Incorrect password. Try again.');
        error.statusCode = 401;
        throw error;
    }

    // step 3: create a JWT token
    const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );

    return res.status(200).json({
        token,
        user: {
            name: user.name,
            role: user.role,
        },
    });
});
