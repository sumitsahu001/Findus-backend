import Application from '../models/Application.model.js';
import Property from '../models/Property.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import { errorResponse } from '../utils/response.js';

/**
 * Apply for a property
 * POST /application/apply/:id
 */
export const applyForProperty = asyncHandler(async (req, res) => {
    const propertyId = req.params.id;
    const renterId = req.user.id;

    // 1. Check if property exists
    const property = await Property.findById(propertyId);
    if (!property) {
        return errorResponse(res, 404, 'Property not found.');
    }

    // 2. Check if renter has already applied
    const existingApplication = await Application.findOne({ property: propertyId, renter: renterId });
    if (existingApplication) {
        return errorResponse(res, 400, 'You have already applied for this property.');
    }

    // 3. Create application
    const application = new Application({
        property: propertyId,
        renter: renterId,
        landlord: property.owner,
        message: req.body.message || 'I am interested in this property.'
    });

    await application.save();

    res.status(201).json({
        success: true,
        message: 'Application submitted successfully! 🚀',
        data: application
    });
});

/**
 * Get all applications for a landlord
 * GET /application/landlord
 */
export const getLandlordApplications = asyncHandler(async (req, res) => {
    const landlordId = req.user.id;

    const applications = await Application.find({ landlord: landlordId })
        .populate('property', 'title location price images')
        .populate('renter', 'name email mobile occupation annualIncome familySize bio');

    res.status(200).json({
        success: true,
        data: applications
    });
});


/**
 * Get all applications submitted by a renter
 * GET /application/renter
 */
export const getRenterApplications = asyncHandler(async (req, res) => {
    const renterId = req.user.id;

    const applications = await Application.find({ renter: renterId })
        .populate('property', 'title location price images')
        .populate('landlord', 'name email mobile');

    res.status(200).json({
        success: true,
        data: applications
    });
});

