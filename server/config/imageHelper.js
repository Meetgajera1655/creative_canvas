// config/imageHelper.js — Normalize photo field to a proper URL
const path = require('path');
const fs   = require('fs');

const UPLOAD_DIR = path.join(__dirname, '../uploads');

/**
 * Given a photo value from Firebase (filename, path, or full URL),
 * return a publicly accessible URL string.
 */
function getImageUrl(photo, serverBase = '') {
  if (!photo) return null;
  
  // Already a full HTTP URL (Firebase Storage, Cloudinary, etc.)
  if (photo.startsWith('http://') || photo.startsWith('https://')) {
    return photo;
  }
  
  // Strip any leading path separators and directory traversal
  const base = path.basename(photo.replace(/\\/g, '/'));
  
  // Check if file exists in uploads directory
  const localPath = path.join(UPLOAD_DIR, base);
  if (fs.existsSync(localPath)) {
    return `/uploads/${base}`;
  }
  
  // Return as-is (server will try to serve it)
  return `/uploads/${base}`;
}

module.exports = { getImageUrl };
