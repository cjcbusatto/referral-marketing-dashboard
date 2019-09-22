const Admin = require('../models/Admin');

module.exports = {
    async signup(req, res, next) {
        res.json({
            message: 'Signup successful',
            user: req.user,
        });
    },
};
