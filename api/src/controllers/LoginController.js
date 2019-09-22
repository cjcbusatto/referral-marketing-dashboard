const { Types } = require('mongoose');
const Student = require('../models/Student');
const University = require('../models/University');
const passport = require('passport');
const jwt = require('jsonwebtoken');

module.exports = {
    async store(req, res, next) {
        const { JWT_SECRET } = process.env;
        passport.authenticate('login', async (err, admin, info) => {
            try {
                if (err || !admin) {
                    const error = new Error('An Error occured');
                    return next(error);
                }
                req.login(admin, { session: false }, async (error) => {
                    if (error) return next(error);

                    //We don't want to store the sensitive information such as the
                    //admin password in the token so we pick only the email and id
                    const body = { _id: admin._id, username: admin.username };

                    //Sign the JWT token and populate the payload with the admin email and id
                    const token = jwt.sign({ admin: body }, process.env.JWT_SECRET);

                    //Send back the token to the admin
                    return res.json({ token });
                });
            } catch (error) {
                return next(error);
            }
        })(req, res, next);
    },
};
