const express = require('express');
const passport = require('passport');

const routes = express.Router();
const CampaignController = require('./controllers/CampaignController');
const DiscountModeController = require('./controllers/DiscountModeController');
const UniversityController = require('./controllers/UniversityController');
const StudentController = require('./controllers/StudentController');
const LoginController = require('./controllers/LoginController');
const SignupController = require('./controllers/SignupController');

// Login routes
routes.post('/signup', passport.authenticate('signup', { session: false }), SignupController.signup);
routes.post('/login', LoginController.store);

// Campaign routes
routes.get('/campaigns', CampaignController.index);
routes.get('/campaigns/:id', CampaignController.view);
routes.put('/campaigns/:id', CampaignController.edit);
routes.post('/campaigns', CampaignController.store);
routes.delete('/campaigns/:id', CampaignController.delete);

// DiscountMode routes
routes.get('/discountmodes', DiscountModeController.index);
routes.get('/discountmodes/:id', DiscountModeController.view);
routes.post('/discountmodes', DiscountModeController.store);
routes.delete('/discountmodes/:id', DiscountModeController.delete);

// University routes
routes.get('/universities', UniversityController.index);
routes.get('/universities/:id', UniversityController.view);
routes.put('/universities/:id', UniversityController.edit);
routes.post('/universities', UniversityController.store);
routes.delete('/universities/:id', UniversityController.delete);

// Campaign routes
routes.get('/students', StudentController.index);
routes.get('/students/:id', StudentController.view);
routes.put('/students/:id', StudentController.edit);
routes.post('/students', StudentController.store);
routes.delete('/students/:id', StudentController.delete);

module.exports = routes;
