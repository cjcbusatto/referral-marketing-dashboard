const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

const AdminSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
});

// Hash the password before stores on the database
AdminSchema.pre('save', async function(next) {
    const hash = await bcrypt.hash(this.password, 10);

    // Replace the plain text password with the hash and then store it
    this.password = hash;

    // Moves on to the next middleware
    next();
});

AdminSchema.methods.isValidPassword = async function(password) {
    // Hashes the password sent by paraemter and checks if the hashed password stored in the
    // database matches.
    const compare = await bcrypt.compare(password, this.password);
    return compare;
};

module.exports = model('Admin', AdminSchema);
