const { Schema, model } = require('mongoose');
const NAME_REGEX = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/g;

const UniversitySchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            min: [2, 'University name must have at least 2 characters'],
            max: [50, 'University name must have maximum 50 characters'],
        },
        enrolledStudents: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Student',
                default: '',
            },
        ],
    },
    { timestamps: true }
);

UniversitySchema.statics.exists = async function exists(name) {
    const university = await this.model('University')
        .findOne({ name })
        .exec();
    console.log(university);
    if (!university) {
        return false;
    }

    return true;
};

module.exports = model('University', UniversitySchema);
