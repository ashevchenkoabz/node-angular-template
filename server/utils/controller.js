"use strict";
const Cache = require('./redis');
const jwt = require('jsonwebtoken');
const config = require('./../../config');

class Controller {
    constructor (version) {
        this.VERSION = version;

        /**
         * validate skip and count parameters for getting any resource
         * @param req
         * @param res
         * @param next
         * @returns {*}
         * @private
         */
        this.validateLimits  = function (req, res, next) {
            req.query.limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 50;
            req.query.offset = parseInt(req.query.offset) ? parseInt(req.query.offset) : 0;

            return next();
        };

        this.validator = require('./../validators/' + version)
    }

    /**
     * Create token
     * @private
     */
    static _createUserToken(client) {
        let tokenParams = {};
        tokenParams.createTime = Date.now();
        tokenParams.id = client.id;

        let clientData = client.dataValues || client;
        let user = clientData;
        user.token = jwt.sign(tokenParams, config.jwtKey);
        user.tokenExpiresAt = new Date(tokenParams.createTime + config.jwtLifeTime).toISOString();
        Cache.set(user.token, user.id);
        return user;
    }
}

module.exports = Controller;
