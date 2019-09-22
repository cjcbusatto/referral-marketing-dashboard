const { Schema, model } = require('mongoose');
const DiscountModeSchema = new Schema(
    {
        name: { type: String, required: true, default: 'Custom discount' },
        rules: [
            {
                numberOfPeople: { type: Number, required: 'numberOfPeople is required' },
                discountGiven: { type: Number, required: 'discountGiven is required' },
            },
        ],
    },
    { timestamps: true }
);

module.exports = model('DiscountMode', DiscountModeSchema);
