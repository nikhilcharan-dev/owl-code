import express from 'express';
import { setupProfile, uploadResume, getDashboard, getBatchSchedule, upload } from '../controllers/traineeController.js';

const router = express.Router();

// Profile setup / update
router.put('/setup-profile', setupProfile);

// Resume upload (multipart)
router.post('/upload-resume', upload.single('resume'), uploadResume);

// Dashboard data for trainee
router.get('/dashboard', getDashboard);
router.get('/batch/:batchId/schedule', getBatchSchedule);

export default router;
