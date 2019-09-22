const { Schema, model } = require('mongoose');

const CampaignSchema = new Schema(
    {
        university: {
            type: Schema.Types.ObjectId,
            ref: 'University',
        },
        endDate: {
            type: Number,
            required: true,
        },
        discountMode: {
            type: Schema.Types.ObjectId,
            ref: 'DiscountMode',
        },
    },
    { timestamps: true }
);

module.exports = model('Campaign', CampaignSchema);
