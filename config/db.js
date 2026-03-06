import mongoose from 'mongoose';

// Connects to MongoDB using the URI from .env
// Called once at server startup — if this fails, app won't start
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.error('DB connection failed:', error.message);
        process.exit(1); // crash the process — no point running without a DB
    }
};

export default connectDB;
