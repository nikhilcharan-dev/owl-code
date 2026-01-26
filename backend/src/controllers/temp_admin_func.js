
// Get trainees specifically for a batch
export const getTraineesByBatch = async (req, res) => {
    try {
        const { batchId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';
        const skip = (page - 1) * limit;

        if (!mongoose.Types.ObjectId.isValid(batchId)) {
            return res.status(400).json({ msg: 'Invalid Batch ID' });
        }

        // Strict query: MUST match this batch
        const query = {
            role: 'trainee',
            assignedBatches: new mongoose.Types.ObjectId(batchId)
        };

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { workEmail: { $regex: search, $options: 'i' } },
                { studentId: { $regex: search, $options: 'i' } }
            ];
        }

        const trainees = await User.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await User.countDocuments(query);

        res.json({
            trainees,
            page,
            totalPages: Math.ceil(total / limit),
            totalTrainees: total,
            batchId // Confirm back the ID used
        });

    } catch (err) {
        console.error('getTraineesByBatch Error:', err);
        res.status(500).json({ msg: err.message });
    }
};
