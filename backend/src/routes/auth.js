import express from 'express';
import { login, registerAdmin } from '../controllers/authController.js';

const router = express.Router();

// Login route
router.post('/login', login);

// Register admin route
router.post('/register-admin', registerAdmin);

export default router;
