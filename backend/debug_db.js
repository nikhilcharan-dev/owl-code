
import mongoose from 'mongoose';
import User from './src/models/User.js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/owl-code');
        console.log('MongoDB Connected');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

const debug = async () => {
    await connectDB();

    console.log("--- DEBUGGING USER DATA ---");
    // Find one trainee who has assignedBatches
    const user = await User.findOne({ assignedBatches: { $exists: true, $not: { $size: 0 } } });

    if (user) {
        console.log(`Found User: ${user.name}`);
        console.log('Assigned Batches:', user.assignedBatches);
        console.log('Type of first batch ID:', typeof user.assignedBatches[0]);
        console.log('Constructor of first batch ID:', user.assignedBatches[0].constructor.name);
    } else {
        console.log("No users with assigned batches found.");
    }

    process.exit();
};

debug();
