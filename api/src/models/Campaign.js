const { Schema, model } = require('mongoose');

const CampaignSchema = new Schema(
    {
        university: {
            type: Schema.Types.ObjectId,
            ref: 'University',
            required: true,
        },
        endDate: {
            type: Number,
            required: true,
        },
        subscriptions: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Student',
            },
        ],
        discountMode: {
            type: Schema.Types.ObjectId,
            ref: 'DiscountMode',
        },
    },
    { timestamps: true }
);

module.exports = model('Campaign', CampaignSchema);
