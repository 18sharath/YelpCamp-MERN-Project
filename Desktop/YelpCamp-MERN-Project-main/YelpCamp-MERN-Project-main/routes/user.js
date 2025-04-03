const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const flash = require('connect-flash')
const session = require('express-session');
const { storeReturnTo } = require('../middleware');
const users=require('../controllers/users');
const user = require('../models/user');


router.get('/register', users.renderRegister );

router.post('/register', catchAsync(users.register))
router.get('/login', users.renderlogin);


router.post('/login',  storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login);


router.get('/logout', users.logout);

module.exports = router;
