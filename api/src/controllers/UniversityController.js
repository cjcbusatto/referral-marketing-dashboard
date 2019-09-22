const { Types } = require('mongoose');
const University = require('../models/University');

module.exports = {
    async index(req, res) {
        const universities = await University.find();
        if (universities.length === 0) {
            return res.status(204).send();
        }
        return res.status(200).json(universities);
    },
    async store(req, res) {
        const { name } = req.body;

        // Look for duplicates
        if (await University.exists(name)) {
            return res.status(409).json({
                error: `University "${name}" is already defined. If you want to modify the content, please edit the resource instead`,
            });
        }

        // Create the university
        const university = new University({ name });
        try {
            await university.save();
            return res.status(200).json(university);
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
            await University.updateOne({ _id: Types.ObjectId(id) }, req.body);

            const updatedUniversity = await University.findById(id);
            return res.status(200).json(updatedUniversity);
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

        const university = await University.findById(id);
        if (!university) {
            return res.status(404).json({ error: 'University not found' });
        }

        return res.status(200).json(university);
    },
    async delete(req, res) {
        const { id } = req.params;
        if (!Types.ObjectId.isValid(id)) {
            return res.status(500).json({ error: 'id must be a valid ObjectId' });
        }

        const universityRemoved = await University.findByIdAndDelete(id);
        if (!universityRemoved) {
            return res.status(404).json({ error: 'University not found' });
        }

        return res.status(200).json(universityRemoved);
    },
};
