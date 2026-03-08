import express from 'express';
import { getAllProperties, getCategories, getLocations, addProperty } from '../controllers/property.controller.js';
import verifyToken, { checkRole } from '../middleware/auth.middleware.js';
import upload from '../middleware/upload.middleware.js';

const router = express.Router();

// Public routes for fetching property data
router.get('/all', getAllProperties);
router.get('/categories', getCategories);
router.get('/locations', getLocations);

// Protected routes — only Landlords can list properties
// We use verifyToken for authentication and upload.array('images', 5) for multi-file images
router.post('/add', verifyToken, checkRole(['landlord']), upload.array('images', 5), addProperty);

export default router;
