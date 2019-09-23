const { Types } = require('mongoose');
const Campaign = require('../models/Campaign');
const Student = require('../models/Student');
const EmailMarketing = require('../models/EmailMarketing');
const University = require('../models/University');

const {
    HTTP_SUCCESS,
    HTTP_NO_CONTENT,
    HTTP_CONFLICT,
    HTTP_BAD_REQUEST,
    HTTP_INTERNAL_SERVER_ERROR,
    HTTP_NOT_FOUND,
} = require('../models/HTTPResponseCode');

module.exports = {
    async index(req, res) {
        const campaigns = await Campaign.find()
            .populate('university')
            .populate('discountMode', 'rules')
            .populate('student');

        if (campaigns.length === 0) {
            return res.status(HTTP_NO_CONTENT).send();
        }

        return res.status(HTTP_SUCCESS).json(campaigns);
    },
    async store(req, res) {
        const { university: universityId, endDate, discountMode } = req.body;

        // Look for duplicates
        const campaignAlreadyDefined = await Campaign.findOne({ universityId });
        if (campaignAlreadyDefined) {
            return res.status(HTTP_CONFLICT).json({
                error: `Campaign for the university "${university}" is already defined.
                        If you want to modify the content, please edit the it instead`,
            });
        }

        const university = await University.findById(universityId);
        if (!university) {
            return res.status(HTTP_NOT_FOUND).json({
                error: `The university ${universityId} was not found, check your inputs`,
            });
        }

        // Create the campaign
        try {
            const campaign = new Campaign({ university: universityId, endDate, discountMode });
            await campaign.save();

            // Get all students for the university
            const students = await Student.find({ university: university._id });
            // Send email to all students of this university
            const subject = `${university.name} is part of a discount group!`;
            const content =
                `Subscribe to the program using the link ` +
                `http://localhost:3000/subscribe/${campaign._id}`;

            const emailMarketing = new EmailMarketing({
                subject,
                content,
                recipients: students,
            });
            await emailMarketing.save();
            return res.status(HTTP_SUCCESS).json(campaign);
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
    async edit(req, res, next) {
        const { id } = req.params;
        const { studentId } = req.body;

        const campaign = await Campaign.findById(id);
        if (!campaign) {
            return res.status(HTTP_NOT_FOUND).json({ error: 'Campaign not found' });
        }

        if (studentId && Types.ObjectId.isValid(studentId)) {
            // Check if the Student Id exists in the database
            const student = await Student.findById(studentId);
            if (!student) {
                return res.status(HTTP_NOT_FOUND).json({ error: 'Student not found' });
            }
            try {
                campaign.subscriptions.push(studentId);
                await campaign.save();

                // Create an email marketing to notify user about his/her subscrition
                const subject = 'You are now subscribed to the discount group!';
                const content =
                    `In the end of the promotion, you will receive a discount code to ` +
                    `use in your purchases! Do not forget to invite your friends with the ` +
                    `URL http://localhost:3000/subscribe/${campaign._id}`;

                const emailMarketing = new EmailMarketing({
                    subject,
                    content,
                    recipients: student._id,
                });
                await emailMarketing.save();

                const updatedCampaign = await Campaign.findById(id);
                return res.status(HTTP_SUCCESS).json(updatedCampaign);
            } catch (err) {
                if (err.name === 'ValidationError') {
                    return res.status(HTTP_BAD_REQUEST).json({ error: err.message });
                }
                console.error(err);
                return next(err);
            }
        }
    },
    async view(req, res) {
        const { id } = req.params;
        if (!Types.ObjectId.isValid(id)) {
            return res
                .status(HTTP_INTERNAL_SERVER_ERROR)
                .json({ error: 'id must be a valid ObjectId' });
        }

        const campaign = await Campaign.findById(id)
            .populate('university')
            .populate('discountMode');
        if (!campaign) {
            return res.status(HTTP_NOT_FOUND).json({ error: 'Campaign not found' });
        }

        return res.status(HTTP_SUCCESS).json(campaign);
    },
    async delete(req, res) {
        const { id } = req.params;
        if (!Types.ObjectId.isValid(id)) {
            return res
                .status(HTTP_INTERNAL_SERVER_ERROR)
                .json({ error: 'id must be a valid ObjectId' });
        }

        const campaignRemoved = await Campaign.findByIdAndDelete(id);
        if (!campaignRemoved) {
            return res.status(HTTP_NOT_FOUND).json({ error: 'Campaign not found' });
        }

        return res.status(HTTP_SUCCESS).json(campaignRemoved);
    },
};
