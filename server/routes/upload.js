// routes/upload.js
const router = require('express').Router();
const multer = require('multer');
const path   = require('path');
const { adminMiddleware } = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, path.join(__dirname, '../uploads')),
  filename:    (_, file, cb) => cb(null, Date.now() + '_' + file.originalname.replace(/\s/g,'_'))
});
const upload = multer({ storage, limits: { fileSize: 5*1024*1024 } });

router.post('/', adminMiddleware, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  res.json({ filename: req.file.filename, url: '/uploads/' + req.file.filename });
});

module.exports = router;
