import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import multer from 'multer';
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import traineeRoutes from './routes/trainee.js';
import challengeRoutes from './routes/challenge.js';
import { verifyToken } from './middlewares/auth.js';
import path from 'path';

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use(multer().any());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', verifyToken, adminRoutes);
app.use('/api/trainee', verifyToken, traineeRoutes);
app.use('/api/challenges', verifyToken, challengeRoutes);

export default app;
