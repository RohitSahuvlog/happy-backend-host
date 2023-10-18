const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const originalName = file.originalname;
    const fileExtension = originalName.split('.').pop();
    const filename = originalName.replace('.' + fileExtension, '') + '-' + uniqueSuffix + '.' + fileExtension;

    cb(null, filename);
  },
});

module.exports = storage;
