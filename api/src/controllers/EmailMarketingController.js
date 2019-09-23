const { Types } = require('mongoose');
const EmailMarketing = require('../models/EmailMarketing');
const Student = require('../models/Student');
const {
    HTTP_SUCCESS,
    HTTP_NO_CONTENT,
    HTTP_BAD_REQUEST,
    HTTP_INTERNAL_SERVER_ERROR,
    HTTP_NOT_FOUND,
} = require('../models/HTTPResponseCode');

module.exports = {
    async index(req, res) {
        const emailMarketings = await EmailMarketing.find().populate('student');
        if (emailMarketings.length === 0) {
            return res.status(HTTP_NO_CONTENT).send();
        }

        return res.status(HTTP_SUCCESS).json(emailMarketings);
    },
    async store(req, res) {
        const { university: universityId, subject, content } = req.body;

        // Get all the students from the university
        const students = await Student.find({ university: Types.ObjectId(universityId) });
        const studentIds = students.map((student) => student._id);

        const emailMarketing = new EmailMarketing({ subject, content, recipients: studentIds });

        try {
            await emailMarketing.save();
            return res.status(HTTP_SUCCESS).json(emailMarketing);
        } catch (err) {
            // Check for errors during the model validation
            if (err.name === 'ValidationError') {
                return res.status(HTTP_BAD_REQUEST).json({ error: err.message });
            }
            console.error(err);

            // Unexpected error, forward the message for logging system
            return next(err);
        }
    },
    async view(req, res) {
        const { id } = req.params;
        if (!Types.ObjectId.isValid(id)) {
            return res
                .status(HTTP_INTERNAL_SERVER_ERROR)
                .json({ error: 'id must be a valid ObjectId' });
        }

        const emailMarketing = await EmailMarketing.findById(id);

        if (!emailMarketing) {
            return res.status(HTTP_NOT_FOUND).json({ error: 'Email marketing not found' });
        }

        return res.status(HTTP_SUCCESS).json(emailMarketing);
    },
    async delete(req, res) {
        const { id } = req.params;
        if (!Types.ObjectId.isValid(id)) {
            return res
                .status(HTTP_INTERNAL_SERVER_ERROR)
                .json({ error: 'id must be a valid ObjectId' });
        }

        const emailMarketingRemoved = await EmailMarketing.findByIdAndDelete(id);
        if (!emailMarketingRemoved) {
            return res.status(HTTP_NOT_FOUND).json({ error: 'Email marketing not found' });
        }

        return res.status(HTTP_SUCCESS).json(emailMarketingRemoved);
    },
};
