const { Schema, model } = require('mongoose');

const PromotionalCodeSchema = new Schema(
    {
        code: {
            type: Schema.Types.ObjectId,
        },
        campaign: {
            type: Schema.Types.ObjectId,
            ref: 'Campaign',
        },
        discount: {
            type: Number,
        },
    },
    { timestamps: true }
);

module.exports = model('PromotionalCode', PromotionalCodeSchema);
