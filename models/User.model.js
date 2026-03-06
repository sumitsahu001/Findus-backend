import mongoose from 'mongoose';

// This is the shape of every user stored in MongoDB
// Mongoose enforces this structure — unlike plain MongoDB which lets you save anything
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
        },

        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,       // can't register same email twice
            lowercase: true,    // always store as lowercase to avoid "Test@mail.com" vs "test@mail.com" duplicates
            trim: true,
        },

        // stored as bcrypt hash — never the real password
        password: {
            type: String,
            required: [true, 'Password is required'],
        },

        mobile: {
            type: String,
            required: [true, 'Mobile is required'],
        },

        address: {
            type: String,
            required: [true, 'Address is required'],
        },

        city: {
            type: String,
            default: 'Indore', // app is Indore-specific right now
        },

        area: {
            type: String,
            required: [true, 'Area is required'],
        },

        gender: {
            type: String,
            enum: ['male', 'female'], // only these two values allowed
            default: 'male',
        },

        // used by PrivateRoute on frontend to check if user has access
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },
    },
    {
        // Mongoose auto-adds createdAt and updatedAt fields
        timestamps: true,
    }
);

const User = mongoose.model('User', userSchema);

export default User;
