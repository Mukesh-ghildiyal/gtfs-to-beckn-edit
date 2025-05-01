import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';
import { GTFSFile } from '../types/gtfs';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Mock database for GTFS files
let gtfsFiles: GTFSFile[] = [];

// Get all GTFS files
router.get('/files', (req, res) => {
  res.json(gtfsFiles);
});

// Update a GTFS file
router.put('/files/:id', (req, res) => {
  const { id } = req.params;
  const updatedFile = req.body;
  
  gtfsFiles = gtfsFiles.map(file => 
    file.id === id ? { ...file, ...updatedFile } : file
  );
  
  res.json(gtfsFiles.find(file => file.id === id));
});

// Delete a GTFS file
router.delete('/files/:id', (req, res) => {
  const { id } = req.params;
  
  // Delete the actual file from the filesystem
  const file = gtfsFiles.find(f => f.id === id);
  if (file) {
    const filePath = path.join(uploadsDir, file.name);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
  
  gtfsFiles = gtfsFiles.filter(file => file.id !== id);
  res.status(204).send();
});

// Upload a new GTFS file
router.post('/files/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const file: GTFSFile = {
    id: Date.now().toString(),
    name: req.file.originalname,
    type: path.extname(req.file.originalname).slice(1),
    lastModified: new Date().toISOString(),
    size: (req.file.size / 1024).toFixed(2) + ' KB'
  };

  gtfsFiles.push(file);
  res.status(201).json(file);
});

// Validate a GTFS file
router.post('/files/validate', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // Basic validation - check if it's a valid GTFS file
  const isValid = req.file.originalname.endsWith('.txt');
  const errors = isValid ? [] : ['File must be a .txt file'];

  res.json({ isValid, errors });
});

export default router; 