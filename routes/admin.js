const express = require('express');
const route = express.Router();

const adminControllers = require('../controllers/admin')

const {check} = require('express-validator')

route.post('/signup', 
check('name')
.not()
.isEmpty(),
check('email')
.normalizeEmail(),
check('password')
.isLength({min:8})
,adminControllers.signup)

route.post('/login', 
check('email')
.normalizeEmail(),
check('password')
.isLength({min:8})
,adminControllers.login)

route.get('/',adminControllers.getAdmin)

module.exports = route