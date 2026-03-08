import Property from '../models/Property.model.js';
import asyncHandler from '../utils/asyncHandler.js';

// GET /property/all
export const getAllProperties = asyncHandler(async (req, res) => {
    // For now, return an empty array if no properties found, 
    // or some sample data so the user can see it working.
    const properties = await Property.find().populate('owner', 'name email');
    res.status(200).json({
        success: true,
        data: properties
    });
});

// GET /property/categories
export const getCategories = asyncHandler(async (req, res) => {
    // Hardcoded for now based on the model enum
    const categories = ['Flat', 'House', 'Office', 'Plot', 'other'];
    res.status(200).json({
        success: true,
        data: categories
    });
});

// GET /property/locations
export const getLocations = asyncHandler(async (req, res) => {
    // Hardcoded for now for Indore project scope
    const locations = ['Vijay Nagar', 'Rajwada', 'Bhanwarkuan', 'Palasia', 'LIG'];
    res.status(200).json({
        success: true,
        data: locations
    });
});

// POST /property/add
// Allows a Landlord to list a new property
export const addProperty = asyncHandler(async (req, res) => {
    // 1. Process uploaded files if any
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
        imageUrls = req.files.map(file => `/uploads/${file.filename}`);
    }

    const { title, description, price, location, category, amenities } = req.body;

    // 2. Validate basic fields
    if (!title || !price || !location) {
        return errorResponse(res, 400, 'Title, Price and Location are mandatory!');
    }

    // 3. Create new property with Landlord ID and Image URLs
    const newProperty = new Property({
        title,
        description,
        price,
        location,
        category,
        amenities: amenities ? amenities.split(',').map(a => a.trim()) : [],
        images: imageUrls, // Store the paths to uploaded files
        owner: req.user.id
    });

    await newProperty.save();

    res.status(201).json({
        success: true,
        message: 'Property listed successfully! 🏠🚀',
        data: newProperty
    });
});
