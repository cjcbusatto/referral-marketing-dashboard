const axios = require('axios');
const { Types } = require('mongoose');
const DiscountMode = require('../models/DiscountMode');

module.exports = {
    async index(req, res) {
        const discountModes = await DiscountMode.find();
        if (discountModes.length === 0) {
            return res.status(204).send();
        }
        return res.status(200).json(discountModes);
    },
    async store(req, res, next) {
        const { name, rules } = req.body;

        const discountMode = new DiscountMode({ name, rules });
        try {
            await discountMode.save();

            return res.status(200).json(discountMode);
        } catch (err) {
            // Check for errors during the model validation
            if (err.name === 'ValidationError') {
                return res.status(400).json({ error: err.message });
            }

            // Unexpected error, forward the message for logging system
            return next(err);
        }
    },
    async view(req, res) {
        const { id } = req.params;
        if (!Types.ObjectId.isValid(id)) {
            return res.status(500).json({ error: 'id must be a valid ObjectId' });
        }

        const discountMode = await DiscountMode.findById(id);
        if (!discountMode) {
            return res.status(404).json({ error: 'Discount mode not found' });
        }

        return res.status(200).json(discountMode);
    },
    async delete(req, res) {
        const { id } = req.params;
        if (!Types.ObjectId.isValid(id)) {
            return res.status(500).json({ error: 'id must be a valid ObjectId' });
        }

        const discountModeRemoved = await DiscountMode.findByIdAndDelete(id);
        if (!discountModeRemoved) {
            return res.status(404).json({ error: 'Discount mode not found' });
        }

        return res.status(200).json(discountModeRemoved);
    },
};
