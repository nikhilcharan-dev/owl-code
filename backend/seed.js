import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './src/models/User.js';

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.DB_URI);
        console.log('Connected to MongoDB for seeding...');

        // Clear existing trainers and trainees (optional, keeping admins)
        await User.deleteMany({ role: { $in: ['trainer', 'trainee'] } });
        console.log('Cleared existing trainers and trainees.');

        const salt = await bcrypt.genSalt(10);
        const defaultPassword = await bcrypt.hash('password123', salt);

        // Seed 5 Trainers
        const trainers = [];
        for (let i = 1; i <= 5; i++) {
            trainers.push({
                name: `Trainer ${i}`,
                workEmail: `trainer${i}@owlcode.com`,
                password: defaultPassword,
                role: 'trainer'
            });
        }
        await User.insertMany(trainers);
        console.log('Successfully seeded 5 trainers.');

        // Seed 50 Trainees
        const trainees = [];
        for (let i = 1; i <= 50; i++) {
            trainees.push({
                name: `Trainee ${i}`,
                workEmail: `trainee${i}@owlcode.com`,
                password: defaultPassword,
                role: 'trainee'
            });
        }
        await User.insertMany(trainees);
        console.log('Successfully seeded 50 trainees.');

        console.log('Seeding complete!');
        process.exit(0);
    } catch (err) {
        console.error('Seeding failed:', err.message);
        process.exit(1);
    }
};

seedData();
