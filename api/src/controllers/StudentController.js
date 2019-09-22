const { Types } = require('mongoose');
const Student = require('../models/Student');
const University = require('../models/University');
const Campaign = require('../models/Campaign');

module.exports = {
    async index(req, res) {
        const students = await Student.find();

        if (students.length === 0) {
            return res.status(204).send();
        }
        return res.status(200).json(students);
    },
    async store(req, res) {
        const { name, email, universityId } = req.body;

        // Check if the university is valid
        const university = University.findById(universityId);
        if (!university) {
            return res.status(400).json({
                error: 'Invalid "universityId", check if the "universityId" provided is correct',
            });
        }

        // Look for duplicates
        if (await Student.exists(email)) {
            return res.status(409).json({
                error: `Student is already enrolled to "${universityId}" with this email. If you want to modify the content, please edit the resource instead`,
            });
        }

        // Create the Student
        const student = new Student({ name, email, university: Types.ObjectId(universityId) });
        try {
            await student.save();

            return res.status(200).json(student);
        } catch (err) {
            // Check for errors during the model validation
            if (err.name === 'ValidationError') {
                return res.status(400).json({ error: err.message });
            }
            console.error(err);

            // Unexpected error, forward the message for logging system
            return next(err);
        }
    },
    async edit(req, res, next) {
        const { id } = req.params;

        try {
            await Student.updateOne({ _id: Types.ObjectId(id) }, req.body);

            const student = await Student.findById(id);
            return res.status(200).json(student);
        } catch (err) {
            if (err.name === 'ValidationError') {
                return res.status(400).json({ error: err.message });
            }
            console.error(err);
            return next(err);
        }
    },
    async view(req, res) {
        const { id } = req.params;
        if (!Types.ObjectId.isValid(id)) {
            return res.status(500).json({ error: 'id must be a valid ObjectId' });
        }

        const student = await Student.findById(id);
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        return res.status(200).json(student);
    },
    async delete(req, res) {
        const { id } = req.params;
        if (!Types.ObjectId.isValid(id)) {
            return res.status(500).json({ error: 'id must be a valid ObjectId' });
        }

        // Delete student document
        const student = await Student.findById(id);
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }
        await student.remove();

        // Unlink its id to a campaign subscription
        try {
            const campaign = await Campaign.findOne({ subscriptions: id });
            if (campaign) {
                campaign.subscriptions.pull(id);
                await campaign.save();
            }

            return res.status(200).json(student);
        } catch (err) {
            console.error(err);
        }
    },
};
