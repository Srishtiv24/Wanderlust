const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure with our Cloudinary account
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key:    process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// ─────────────────────────────────────────────────────────────
// Async params lets us inspect the incoming file's mimetype
// and set resource_type accordingly — this is the key fix for
// video uploads being rejected.
// ─────────────────────────────────────────────────────────────
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const isVideo = file.mimetype.startsWith('video/');
    return {
      folder: 'wanderlust_DEV',
      resource_type: isVideo ? 'video' : 'image',   // ← was missing; caused video rejection
      allowed_formats: isVideo
        ? ['mp4', 'mov', 'avi', 'webm', 'mkv']
        : ['jpg', 'jpeg', 'png', 'webp'],
    };
  },
});

module.exports = { cloudinary, storage };