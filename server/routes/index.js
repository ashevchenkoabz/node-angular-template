"use strict";
const apiRouter = require('./api');
const adminRouter = require('./admin');
const generalRouter = require('./general');

module.exports = {
    api: apiRouter,
    admin: adminRouter,
    general: generalRouter
};
