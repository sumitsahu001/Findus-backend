import 'dotenv/config';         // load .env first — before anything else reads from process.env
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import errorMiddleware from './middleware/error.middleware.js';

const app = express();
const PORT = process.env.PORT || 5000;

// --- MIDDLEWARE STACK ---
// These run on EVERY request, in order, before any route handler

// CORS: browser security blocks requests from a different origin (port 3000 → 5000)
// We allow local development and our live Netlify URL
const allowedOrigins = [
    'http://localhost:3000',
    'https://findus-by-sumit.netlify.app'
];

app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true
}));

// Parse incoming JSON body — without this, req.body is undefined
app.use(express.json());

// Morgan logs every request to console in dev: "POST /user/login 200 45ms"
// Helps debug without writing console.log everywhere
app.use(morgan('dev'));

// --- ROUTES ---
// All auth routes are mounted under /user
// So POST /user/save and POST /user/login work from here
app.use('/user', authRoutes);

// Health check — quick way to confirm server is running
app.get('/', (req, res) => {
    res.json({ message: 'FindUS API is running 🚀' });
});

/**
 * GLOBAL ERROR HANDLER
 * This MUST be the last middleware in the stack (after all routes).
 * It catches any errors that were passed to next(err).
 */
app.use(errorMiddleware);

// --- START SERVER ---
// Connect to DB first, then start listening
// If DB fails, connectDB() calls process.exit(1) — we never reach app.listen
const startServer = async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
};

startServer();
