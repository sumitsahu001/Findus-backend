import mongoose from 'mongoose';

// This is the shape of every property listed in FindUS
// Author: Sumit Sahu (Production Standard v1.1)
const propertySchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Property title is required'],
        trim: true
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: ['Flat', 'House', 'Office', 'Plot', 'other'],
        default: 'Flat'
    },
    location: {
        type: String,
        required: [true, 'Location is required'],
        trim: true
    },
    price: {
        type: Number,
        required: [true, 'Price is required']
    },
    description: {
        type: String,
        trim: true,
        default: 'No description provided'
    },
    // available = listed for rent | rented = currently occupied
    status: {
        type: String,
        enum: ['available', 'rented', 'inactive'],
        default: 'available'
    },
    images: {
        type: [String],
        default: []
    },
    // The link back to the Landlord who owns this property
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    // Mongoose auto-adds createdAt and updatedAt fields
    timestamps: true
});

const Property = mongoose.model('Property', propertySchema);
export default Property;
