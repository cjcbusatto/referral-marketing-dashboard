const { Schema, model } = require('mongoose');

const EmailMarketingSchema = new Schema(
    {
        recipients: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Student',
                required: true,
            },
        ],
        status: {
            type: String,
            default: 'In progress',
        },
        subject: {
            type: String,
            default: "Don't forget to subscribe!",
        },
        content: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = model('EmailMarketing', EmailMarketingSchema);
