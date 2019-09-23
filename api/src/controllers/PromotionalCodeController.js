const { Types } = require('mongoose');
const PromotionalCode = require('../models/PromotionalCode');
const Campaign = require('../models/Campaign');
const EmailMarketing = require('../models/EmailMarketing');
const {
    HTTP_SUCCESS,
    HTTP_NO_CONTENT,
    HTTP_BAD_REQUEST,
    HTTP_INTERNAL_SERVER_ERROR,
    HTTP_NOT_FOUND,
} = require('../models/HTTPResponseCode');

module.exports = {
    async index(req, res) {
        const promotionalCode = await PromotionalCode.find().populate('student');
        if (promotionalCode.length === 0) {
            return res.status(HTTP_NO_CONTENT).send();
        }

        return res.status(HTTP_SUCCESS).json(promotionalCode);
    },
    async store(req, res) {
        const { campaignId } = req.body;

        // Get campaign
        const campaign = await Campaign.findById(campaignId).populate('discountMode');
        const totalSubscriptions = campaign.subscriptions.length;

        const rules = campaign.discountMode.rules;

        // Uggly, refactor required!
        let discount = 0;
        const minimalPeopleRequirement = rules[0].numberOfPeople;
        for (const rule of rules) {
            if (
                rule.numberOfPeople > totalSubscriptions &&
                totalSubscriptions > minimalPeopleRequirement
            ) {
                discount = rule.discountGiven;
                break;
            }
        }

        const promotionalCode = new PromotionalCode({
            code: Types.ObjectId(),
            campaign: Types.ObjectId(campaignId),
            discount: discount,
        });

        try {
            await promotionalCode.save();

            return res.status(HTTP_SUCCESS).json(promotionalCode);
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

        const promotionalCode = await PromotionalCode.findById(id);

        if (!promotionalCode) {
            return res.status(HTTP_NOT_FOUND).json({ error: 'Promotional code not found' });
        }

        return res.status(HTTP_SUCCESS).json(promotionalCode);
    },
    async delete(req, res) {
        const { id } = req.params;
        if (!Types.ObjectId.isValid(id)) {
            return res
                .status(HTTP_INTERNAL_SERVER_ERROR)
                .json({ error: 'id must be a valid ObjectId' });
        }

        const promotionalCodeRemoved = await PromotionalCode.findByIdAndDelete(id);
        if (!promotionalCodeRemoved) {
            return res.status(HTTP_NOT_FOUND).json({ error: 'Promotional code not found' });
        }

        return res.status(HTTP_SUCCESS).json(promotionalCodeRemoved);
    },
};
