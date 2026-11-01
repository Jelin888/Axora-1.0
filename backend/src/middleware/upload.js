const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');

const UPLOAD_DIR = path.resolve(process.env.UPLOAD_DIR || 'uploads');
const AVATAR_DIR = path.join(UPLOAD_DIR, 'avatars');
fs.mkdirSync(AVATAR_DIR, { recursive: true });

// Allow-list only — executables/scripts (.exe, .sh, .js, .html, ...) are rejected.
const ALLOWED = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png', '.zip'];
const ALLOWED_IMAGES = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

const storage = multer.diskStorage({
  destination: UPLOAD_DIR,
  // Random server-generated name: the client-supplied name is never used on disk
  filename: (req, file, cb) => cb(null, crypto.randomBytes(16).toString('hex') + path.extname(file.originalname).toLowerCase()),
});

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!ALLOWED.includes(ext)) {
      const err = new Error(`File type not allowed. Allowed: ${ALLOWED.join(', ')}`);
      err.status = 400;
      return cb(err);
    }
    cb(null, true);
  },
});

const avatarStorage = multer.diskStorage({
  destination: AVATAR_DIR,
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeName = `avatar-${Date.now()}-${crypto.randomBytes(8).toString('hex')}${ext}`;
    cb(null, safeName);
  },
});

const avatarUpload = multer({
  storage: avatarStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB maximum for avatar images
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const isImageExt = ALLOWED_IMAGES.includes(ext);
    const isImageMime = file.mimetype && file.mimetype.startsWith('image/');
    if (!isImageExt || !isImageMime) {
      const err = new Error(`Invalid file type. Only JPEG, PNG, WEBP, and GIF images are allowed (up to 5MB).`);
      err.status = 400;
      return cb(err);
    }
    cb(null, true);
  },
});

// Safely delete a file previously saved in the uploads directory (prevents path traversal)
function deleteAvatarFile(photoUrl) {
  if (!photoUrl || typeof photoUrl !== 'string') return;
  // Only delete if it's a local upload in /uploads/
  if (!photoUrl.startsWith('/uploads/')) return;

  try {
    const relativePath = photoUrl.replace(/^\/uploads\//, '');
    const absolutePath = path.resolve(UPLOAD_DIR, relativePath);

    // Prevent path traversal outside UPLOAD_DIR
    if (!absolutePath.startsWith(UPLOAD_DIR)) return;

    if (fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath);
    }
  } catch (err) {
    console.warn('Could not delete old avatar file:', err.message);
  }
}

module.exports = { upload, avatarUpload, UPLOAD_DIR, AVATAR_DIR, deleteAvatarFile };

