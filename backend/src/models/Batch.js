import mongoose from 'mongoose';

const BatchSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    trainer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    trainees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
});

export default mongoose.model('Batch', BatchSchema);
