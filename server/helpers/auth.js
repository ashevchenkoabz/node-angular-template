'use strict';

//models
const models = require('./../models/v1');

//modules
const jwt = require('jsonwebtoken');
const config = require('./../../config');

const Cache = require('./../utils/redis');

class Auth {
    /**
     * auth user
     *
     * @param [role=undefined] {string}
     * @returns {function}
     */
    static authentication(role) {
        return function (req, res, next) {
            Cache.get(req.headers.authorization, function(err, result){
                let tokenData;

                if(err) return next(err);

                if(!result){
                    let error = new Error();
                    error.status = 401;
                    error.message = 'not valid token!';
                    return next(error);
                }

                try {
                    tokenData = jwt.verify(req.headers.authorization, config.jwtKey);
                } catch (err) {
                    let error = new Error();
                    error.status = 401;
                    error.message = 'not valid token!';
                    return next(error);
                }

                if (tokenData.createTime + config.jwtLifeTime < Date.now()) {
                    let error = new Error();
                    error.status = 401;
                    error.message = 'token expired!';
                    return next(error);
                }

                let scope = models.users;
                if (role) {
                    scope = scope.scope({method: ['role', models.users.ROLE[role.toUpperCase()]]});
                }

                scope.findById(tokenData.id)
                    .then(function (user) {
                        if (!user || user.length === 0) {

                            let error = new Error();
                            error.status = 401;
                            return next(error);
                        }

                        req.user = user;

                        next();
                    })
                    .catch(next)
            });
        }
    }

    /**
     * check user to be admin
     * @returns {Function}
     */
    static onlyAdmins (req, res, next) {
        if (req.user.role !== models.users.ROLE.ADMIN) {
            let error = new Error();
            error.message = "Access denied for your account";
            error.status = 403;
            return next(error);
        }

        next();
    }
}

module.exports = Auth;
