import mongoose from 'mongoose';

const ScheduleSchema = new mongoose.Schema({
    batch: { type: mongoose.Schema.Types.ObjectId, ref: 'Batch', required: true },
    date: { type: Date, required: true },
    dayNumber: { type: Number, required: true },
    mentorNotes: { type: String },
    assignments: { type: [String] }, // list of assignment IDs or descriptions
});

export default mongoose.model('Schedule', ScheduleSchema);
