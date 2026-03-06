import express from 'express';
import { registerUser, loginUser } from '../controllers/auth.controller.js';
import { validateRegister, validateLogin } from '../middleware/validate.middleware.js';

const router = express.Router();

// Each route: URL → [middleware chain] → controller
// Middleware runs first — if it fails, controller never runs

// POST /user/save → validate inputs → create user
router.post('/save', validateRegister, registerUser);

// POST /user/login → validate inputs → check credentials + return token
router.post('/login', validateLogin, loginUser);

export default router;
