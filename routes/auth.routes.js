import express from 'express';
import { registerUser, loginUser, updateProfile, getProfile, getDashboardStats } from '../controllers/auth.controller.js';
import { validateRegister, validateLogin } from '../middleware/validate.middleware.js';
import verifyToken from '../middleware/auth.middleware.js';

const router = express.Router();

// Each route: URL → [middleware chain] → controller
// Middleware runs first — if it fails, controller never runs

// POST /user/save → validate inputs → create user
router.post('/save', validateRegister, registerUser);

// POST /user/login → validate inputs → check credentials + return token
router.post('/login', validateLogin, loginUser);

// PATCH /user/update → verify JWT → update profile details (CV)
router.patch('/update', verifyToken, updateProfile);

// GET /user/profile → verify JWT → fetch user profile details
router.get('/profile', verifyToken, getProfile);

// GET /user/dashboard-stats → verify JWT → calculate and return renter stats
router.get('/dashboard-stats', verifyToken, getDashboardStats);

export default router;
