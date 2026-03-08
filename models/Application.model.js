import mongoose from 'mongoose';

/**
 * Application Model
 * Author: Sumit Sahu (Production Standard)
 * Links a Renter to a Property listed by a Landlord.
 */
const applicationSchema = new mongoose.Schema({
    property: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property',
        required: true
    },
    renter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    landlord: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    },
    message: {
        type: String,
        trim: true,
        default: 'I am interested in this property.'
    }
}, {
    timestamps: true
});

const Application = mongoose.model('Application', applicationSchema);
export default Application;
