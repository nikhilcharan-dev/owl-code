
import mongoose from 'mongoose';
import User from './src/models/User.js';
import dotenv from 'dotenv';
import path from 'path';
import bcrypt from 'bcryptjs';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URI || 'mongodb://localhost:27017/owl-code');
        console.log('MongoDB Connected');
    } catch (err) {
        console.error('Connection Error:', err.message);
        process.exit(1);
    }
};

const seedTrainees = async () => {
    await connectDB();

    console.log("--- RESETTING TRAINEES ---");

    try {
        // 1. Clear existing trainees
        const deleteResult = await User.deleteMany({ role: 'trainee' });
        console.log(`Deleted ${deleteResult.deletedCount} existing trainees.`);

        // 2. Generate 10 mock trainees
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt); // Default password

        const mockTrainees = [];
        for (let i = 1; i <= 10; i++) {
            mockTrainees.push({
                name: `Mock Trainee ${i}`,
                workEmail: `trainee${i}@example.com`,
                password: hashedPassword,
                role: 'trainee',
                studentId: `STU${1000 + i}`,
                assignedBatches: [] // Start unassigned
            });
        }

        // 3. Insert new trainees
        const insertResult = await User.insertMany(mockTrainees);
        console.log(`Successfully added ${insertResult.length} new mock trainees.`);
        console.log(`Default password: 'password123'`);

    } catch (err) {
        console.error('Seeding Error:', err);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
};

seedTrainees();
