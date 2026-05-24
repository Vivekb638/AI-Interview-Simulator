const multer = require('multer');
const responseFormatter = require('../utils/responseFormatter');
const path = require('path');

// Configure multer for memory storage
const storage = multer.memoryStorage();

// File filter function
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  const allowedExtensions = ['.pdf', '.doc', '.docx'];
  
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedMimeTypes.includes(file.mimetype) && allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF and DOC/DOCX are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB max size
  },
  fileFilter: fileFilter
});

const uploadValidation = (fieldName) => {
  return (req, res, next) => {
    const uploadSingle = upload.single(fieldName);

    uploadSingle(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        return responseFormatter.error(res, `Upload error: ${err.message}`, 400);
      } else if (err) {
        // An unknown error occurred when uploading.
        return responseFormatter.error(res, `Invalid file: ${err.message}`, 400);
      }
      // Everything went fine.
      next();
    });
  };
};

module.exports = uploadValidation;
