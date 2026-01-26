
import mongoose from 'mongoose';
import User from './src/models/User.js';
import Batch from './src/models/Batch.js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URI || 'mongodb://localhost:27017/owl-code');
        console.log('MongoDB Connected');
    } catch (err) {
        console.error('Connection Error:', err);
        process.exit(1);
    }
};

const testQuery = async () => {
    await connectDB();

    console.log("--- TESTING BACKEND QUERY LOGIC ---");

    try {
        // 1. Get a real batch ID from DB or create one
        let batch = await Batch.findOne();
        if (!batch) {
            console.log("No batches found. Creating a dummy batch.");
            batch = await Batch.create({
                name: "Test Batch",
                startDate: new Date(),
                endDate: new Date(),
                // other fields might be required based on schema, mostly refs are optional or have defaults?
                // Checking schema... course and trainer are refs. assuming basic create works or might fail if required.
                // Let's hope findOne works.
            });
        }

        console.log(`Testing with Batch ID: ${batch._id}`);
        const batchIdStr = String(batch._id);

        // 2. Assign a user to this batch
        const user = await User.findOne({ role: 'trainee' });
        if (user) {
            console.log(`Assigning User ${user.name} (${user._id}) to batch ${batch._id}`);
            // Ensure array exists
            if (!user.assignedBatches) user.assignedBatches = [];

            // Clear and set
            user.assignedBatches = [batch._id];
            await user.save();
        } else {
            console.log("No trainees found to assign.");
        }

        // 3. Run the "Controller Logic" Query
        const query = { role: 'trainee' };

        // Emulate the controller logic
        const filters = [batchIdStr];
        if (mongoose.Types.ObjectId.isValid(batchIdStr)) {
            filters.push(new mongoose.Types.ObjectId(batchIdStr));
        }
        query.assignedBatches = { $in: filters };

        console.log("Constructed Query:", JSON.stringify(query, null, 2));

        const results = await User.find(query);
        console.log(`Query Results Count: ${results.length}`);

        results.forEach(u => {
            console.log(` - User: ${u.name}, AssignedBatches: ${u.assignedBatches}`);
        });

        // 4. Test "Invalid/Empty" Batch ID logic (Simulate missing param)
        // If batchId was undefined, controller skips the if(batchId) block.
        // query becomes just { role: 'trainee' }
        console.log("\n--- Testing Empty Batch ID (Should return ALL) ---");
        const allQuery = { role: 'trainee' };
        const allResults = await User.find(allQuery);
        console.log(`All Trainees Count: ${allResults.length}`);

    } catch (err) {
        console.error('Test Error:', err);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
};

testQuery();
