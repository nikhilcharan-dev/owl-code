import mongoose from 'mongoose';

export const AssignmentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    link: { type: String },
    platform: {
        type: String,
        enum: ['leetcode', 'codeforces', 'codechef', 'atcoder', 'hackerrank', 'other'],
        default: 'other'
    },
    category: {
        type: String,
        enum: ['dsa', 'sql', 'system-design', 'development', 'other'],
        default: 'other'
    },
    level: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'medium'
    },
    tags: [String],
    description: String
});

const CourseSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true },
    description: { type: String },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    excludedDays: { type: [Number], default: [0] }, // default skip Sundays
    customHolidays: { type: [Date] },
    dailyAssignments: {
        type: Map,
        of: [AssignmentSchema]
    },
    trainerNotes: {
        type: Map,
        of: String // Date string -> PDF URL
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

export default mongoose.model('Course', CourseSchema);
