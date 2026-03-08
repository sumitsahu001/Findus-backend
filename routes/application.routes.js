import express from 'express';
import { applyForProperty, getLandlordApplications, getRenterApplications } from '../controllers/application.controller.js';
import verifyToken, { checkRole } from '../middleware/auth.middleware.js';

const router = express.Router();

// 1. Renter applies for a property (Protected)
router.post('/apply/:id', verifyToken, checkRole(['renter']), applyForProperty);

// 2. Landlord views their applications (Protected)
router.get('/landlord', verifyToken, checkRole(['landlord']), getLandlordApplications);

// 3. Renter views their own applications (Protected)
router.get('/renter', verifyToken, checkRole(['renter']), getRenterApplications);

export default router;
