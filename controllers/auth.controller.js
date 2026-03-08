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

    // Auto-login after registration (Production Standard)
    const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
    );

    return res.status(201).json({
        success: true,
        message: 'Account created! Now please complete your renter CV.',
        token,
        user: {
            id: user._id,
            name: user.name,
            role: user.role
        }
    });
});

/**
 * Update User Profile (CV)
 * PATCH /user/update
 */
export const updateProfile = asyncHandler(async (req, res) => {
    const { occupation, annualIncome, familySize, bio, mobile, address } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
        const error = new Error('User not found.');
        error.statusCode = 404;
        throw error;
    }

    // Update fields if provided
    if (occupation) user.occupation = occupation;
    if (annualIncome) user.annualIncome = annualIncome;
    if (familySize) user.familySize = familySize;
    if (bio) user.bio = bio;
    if (mobile) user.mobile = mobile;
    if (address) user.address = address;

    await user.save();

    res.status(200).json({
        success: true,
        message: 'Profile updated successfully! 🚀',
        user: {
            id: user._id,
            name: user.name,
            role: user.role,
            occupation: user.occupation
        }
    });
});

/**
 * Get User Profile
 * GET /user/profile
 */
export const getProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
        const error = new Error('User not found.');
        error.statusCode = 404;
        throw error;
    }

    res.status(200).json({
        success: true,
        user
    });
});

/**
 * Get Dashboard Stats (Renter & Landlord)
 * GET /user/dashboard-stats
 */
export const getDashboardStats = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const role = req.user.role;

    const Application = (await import('../models/Application.model.js')).default;
    const Property = (await import('../models/Property.model.js')).default;

    if (role === 'landlord') {
        const activeListings = await Property.countDocuments({ owner: userId });
        const pendingApplications = await Application.countDocuments({ landlord: userId, status: 'pending' });
        const totalApplications = await Application.countDocuments({ landlord: userId });

        return res.status(200).json({
            success: true,
            stats: {
                activeListings,
                pendingApplications,
                totalApplications
            }
        });
    }

    // Default for Renter
    // 1. Calculate Profile Strength
    const user = await User.findById(userId);
    const fields = ['name', 'email', 'mobile', 'address', 'occupation', 'annualIncome', 'familySize', 'bio'];
    let completed = 0;
    fields.forEach(f => {
        if (user[f] && user[f] !== '') completed++;
    });
    const profileStrength = Math.round((completed / fields.length) * 100);

    // 2. Count Active Applications
    const activeApps = await Application.countDocuments({ renter: userId });

    res.status(200).json({
        success: true,
        stats: {
            activeApps,
            profileStrength,
            wishlisted: 0 // Frontend handles this via localStorage
        }
    });
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
