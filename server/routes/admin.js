"use strict";
const controllers = require('../controllers');
const express = require('express');
const auth = require('./../helpers/auth');
const router = express.Router();

router.get('/', controllers.staticFiles.admin);
router.post('/login', controllers.callAction('admin.login'));
router.use(controllers.staticFiles.admin);

router.use(auth.authentication('ADMIN'));


module.exports = router;
