const path = require('path');
const fs = require('fs');
const multer = require('multer');

// Assurer l'existence du dossier de stockage
const uploadDir = path.join(__dirname, '../uploads/documents');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuration du stockage disque avec nom de fichier unique et assaini
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const sanitizedName = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .substring(0, 50);
    const uniqueSuffix = `${Date.now()}_${Math.round(Math.random() * 1e6)}`;
    cb(null, `doc_${sanitizedName}_${uniqueSuffix}${ext}`);
  },
});

// Filtre sur le type MIME et l'extension (PDF exclusivement)
const fileFilter = (req, file, cb) => {
  const isPdfExt = path.extname(file.originalname).toLowerCase() === '.pdf';
  const isPdfMime = file.mimetype === 'application/pdf';

  if (isPdfExt && isPdfMime) {
    cb(null, true);
  } else {
    cb(new Error('Format non autorisé. Seuls les fichiers PDF sont acceptés.'), false);
  }
};

const maxFileSizeMB = parseInt(process.env.MAX_FILE_SIZE_MB, 10) || 15;

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: maxFileSizeMB * 1024 * 1024,
  },
});

module.exports = upload;
