import multer from 'multer';
import path from 'path';
import fs from 'fs';

// 1. Ensure 'uploads' directory exists
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// 2. Configure Storage Engine
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Unique filename: Date-timestamp-OriginalName
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// 3. File Filter (Only Images)
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only JPEG, PNG and JPG images are allowed! 🚫'), false);
    }
};

// 4. Initialize Multer
const upload = multer({
    storage,
    limits: { fileSize: 1024 * 1024 * 5 }, // 5 MB per file
    fileFilter
});

export default upload;
