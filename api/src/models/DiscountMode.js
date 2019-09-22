const { Schema, model } = require('mongoose');
const DiscountModeSchema = new Schema(
    {
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
