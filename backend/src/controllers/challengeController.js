import { Challenge, ChallengeParticipation } from '../models/Challenge.js';

// Create a new challenge
export const createChallenge = async (req, res) => {
    try {
        const { title, description, duration } = req.body;

        const existingChallenge = await Challenge.findOne({ title: { $regex: new RegExp(`^${title}$`, 'i') } });
        if (existingChallenge) {
            return res.status(400).json({ msg: `A challenge with the title "${title}" already exists.` });
        }

        const challenge = new Challenge({
            title,
            description,
            duration,
            createdBy: req.user.id,
            dailyAssignments: new Map()
        });

        await challenge.save();
        res.status(201).json(challenge);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

// Get all challenges
export const getChallenges = async (req, res) => {
    try {
        const challenges = await Challenge.find().sort({ createdAt: -1 });
        res.json(challenges);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

// Get challenge by ID
export const getChallengeById = async (req, res) => {
    try {
        const challenge = await Challenge.findById(req.params.id);
        if (!challenge) return res.status(404).json({ msg: 'Challenge not found' });
        res.json(challenge);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

// Update challenge basic info
export const updateChallenge = async (req, res) => {
    try {
        const { title, description, duration, status } = req.body;

        const existingChallenge = await Challenge.findOne({
            title: { $regex: new RegExp(`^${title}$`, 'i') },
            _id: { $ne: req.params.id }
        });
        if (existingChallenge) {
            return res.status(400).json({ msg: `A challenge with the title "${title}" already exists.` });
        }

        const challenge = await Challenge.findByIdAndUpdate(
            req.params.id,
            { title, description, duration, status },
            { new: true }
        );

        if (!challenge) return res.status(404).json({ msg: 'Challenge not found' });
        res.json(challenge);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

// Delete a challenge
export const deleteChallenge = async (req, res) => {
    try {
        const challenge = await Challenge.findByIdAndDelete(req.params.id);
        if (!challenge) return res.status(404).json({ msg: 'Challenge not found' });

        // Optionally clean up participations
        await ChallengeParticipation.deleteMany({ challenge: req.params.id });

        res.json({ msg: 'Challenge deleted successfully' });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

// Update assignments for a specific day in a challenge
export const updateChallengeAssignments = async (req, res) => {
    try {
        const { dayNumber, assignments } = req.body;
        const challenge = await Challenge.findById(req.params.id);
        if (!challenge) return res.status(404).json({ msg: 'Challenge not found' });

        if (!challenge.dailyAssignments) challenge.dailyAssignments = new Map();

        // Key is string "1", "2", etc.
        challenge.dailyAssignments.set(dayNumber.toString(), assignments);

        await challenge.save();
        res.json(challenge);
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};
