import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';
import sharp from 'sharp';
import { sendResponse } from '../utils/responseHandler.js';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer for in-memory storage
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// Helper function to upload a single file to Cloudinary
const uploadSingleFile = (buffer, fileType) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { resource_type: fileType, folder: 'acquy_media' },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve({
                        url: result.secure_url,
                        publicId: result.public_id
                    });
                }
            }
        );
        streamifier.createReadStream(buffer).pipe(uploadStream);
    });
};

// Middleware to process and upload multiple files to Cloudinary
const uploadToCloudinary = (fieldName = 'images', maxCount = 5) => (req, res, next) => {
    upload.array(fieldName, maxCount)(req, res, async (multerError) => { // Max 10 files
        if (multerError) {
            return sendResponse(res, 400, 'File upload error', { error: multerError.message });
        }

        if (!req.files || req.files.length === 0) {
            // No files uploaded, proceed without uploading to Cloudinary
            req.cloudinaryUrls = [];
            req.cloudinaryPublicIds = [];
            return next();
        }

        try {
            const uploadPromises = req.files.map(async (file) => {
                let processedBuffer = file.buffer;
                const fileType = file.mimetype.startsWith('image/') ? 'image' : 'video';

                // Process images (resize)
                if (fileType === 'image') {
                    processedBuffer = await sharp(file.buffer)
                        .resize({ width: 1200, withoutEnlargement: true }) // Resize to max width of 1200px
                        .jpeg({ quality: 85 }) // Convert to JPEG with 85% quality
                        .toBuffer();
                }

                // Upload to Cloudinary
                return uploadSingleFile(processedBuffer, fileType);
            });

            const results = await Promise.all(uploadPromises);

            // Attach the Cloudinary URLs and public IDs to the request object
            req.cloudinaryUrls = results.map(r => r.url);
            req.cloudinaryPublicIds = results.map(r => r.publicId);

            next();

        } catch (error) {
            console.error('File processing or upload error:', error);
            if (error.message && error.message.includes('Unsupported image format')) {
                return sendResponse(res, 400, 'Unsupported file format for image processing.');
            }
            sendResponse(res, 500, 'An error occurred during file processing or upload.', { error: error.message });
        }
    });
};

export { upload, uploadToCloudinary };
