import mongoose from 'mongoose';

const TraineeProgressSchema = new mongoose.Schema({
    trainee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    batch: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', required: true },
    date: { type: Date, required: true },
    completedAssignments: { type: [String] }, // IDs or titles of assignments
    notes: { type: String },
});

export default mongoose.model('TraineeProgress', TraineeProgressSchema);
