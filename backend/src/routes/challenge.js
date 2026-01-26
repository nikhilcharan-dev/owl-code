import express from 'express';
import { verifyToken, authorizeRoles } from '../middlewares/auth.js';
import {
    createChallenge,
    getChallenges,
    getChallengeById,
    updateChallenge,
    deleteChallenge,
    updateChallengeAssignments
} from '../controllers/challengeController.js';

const router = express.Router();

// All challenge management routes are restricted to admin for now
router.post('/', authorizeRoles('admin'), createChallenge);
router.get('/', authorizeRoles('admin', 'trainer', 'trainee'), getChallenges);
router.get('/:id', authorizeRoles('admin', 'trainer', 'trainee'), getChallengeById);
router.put('/:id', authorizeRoles('admin'), updateChallenge);
router.delete('/:id', authorizeRoles('admin'), deleteChallenge);
router.put('/:id/assignments', authorizeRoles('admin'), updateChallengeAssignments);

export default router;
