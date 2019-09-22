const { Schema, model } = require('mongoose');
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const StudentSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            min: [2, 'Student name must have at least 2 characters'],
            max: [50, 'Student name must have maximum 50 characters'],
        },
        email: {
            type: String,
            required: true,
            validate: EMAIL_REGEX,
        },
    },
    { timestamps: true }
);

StudentSchema.statics.exists = async function exists(email) {
    const student = await this.model('Student')
        .findOne({ email })
        .exec();
    if (!student) {
        return false;
    }

    return true;
};



module.exports = model('Student', StudentSchema);
