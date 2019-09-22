require('dotenv').config();
const { JWT_SECRET } = process.env;
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

const Admin = require('../models/Admin');

// Middleware to handle admin signup
passport.use(
    'signup',
    new LocalStrategy(
        {
            usernameField: 'username',
            passwordField: 'password',
        },
        async (username, password, done) => {
            try {
                // Create a document for the new admin
                const admin = await Admin.create({ username, password });

                // Send the user information to the next middleware
                return done(null, admin);
            } catch (err) {
                console.error(err);
                done(err);
            }
        }
    )
);

// Middleware to handle User login
passport.use(
    'login',
    new LocalStrategy(
        {
            usernameField: 'username',
            passwordField: 'password',
        },
        async (username, password, done) => {
            try {
                // Find the user associated with the email provided by the user
                const admin = await Admin.findOne({ username });
                if (!admin) {
                    //If the admin username isn't found in the database
                    return done(null, false, { message: 'Username not found' });
                }

                // Validate password and make sure it matches with the corresponding
                // hash stored in the database
                const validate = await admin.isValidPassword(password);

                if (!validate) {
                    return done(null, false, { message: 'Wrong Password' });
                }

                // Send the user information to the next middleware
                return done(null, admin, { message: 'Logged in Successfully' });
            } catch (error) {
                return done(error);
            }
        }
    )
);

//This verifies that the token sent by the user is valid
passport.use(
    new JWTstrategy(
        {
            //secret we used to sign our JWT
            secretOrKey: JWT_SECRET,
            //we expect the user to send the token as a query paramater with the name 'secret_token'
            jwtFromRequest: ExtractJWT.fromUrlQueryParameter(JWT_SECRET),
        },
        async (token, done) => {
            try {
                //Pass the user details to the next middleware
                return done(null, token.user);
            } catch (error) {
                done(error);
            }
        }
    )
);
