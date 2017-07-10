"use strict";
const controllers = require('../controllers');
const express = require('express');
const router = express.Router();
const auth = require('./../helpers/auth');

router.post('/:version/signup/:action', controllers.callAction('signup.signup'));
router.post('/:version/signin/:action', controllers.callAction('signin.signin'));

router.use(auth.authentication());

router.route('/:version/users')
    .get(controllers.callAction('users.getList'))
    .post(auth.onlyAdmins, controllers.callAction('users.add'));
router.route('/:version/users/:id')
    .get(controllers.callAction('users.getById'))
    .put(auth.onlyAdmins, controllers.callAction('users.edit'))
    .delete(auth.onlyAdmins, controllers.callAction('users.delete'));

module.exports = router;
