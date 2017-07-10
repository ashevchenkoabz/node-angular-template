'use strict';

const Models = require('./../../models/v1');
const Controller = require('./../../utils/controller');
const config = require('./../../../config');
const Password = require('./../../helpers/password');
const Facebook = require('./../../helpers/facebook');


class SignupController extends Controller {
    constructor(version) {
        super(version);

        this.signup = [this._chooseStrategy];
    }


    /**
     * choose signup strategy
     * @param req
     * @param res
     * @param next
     * @returns {*}
     * @private
     */
    _chooseStrategy(req, res, next) {
        const strategies = {
            basic: [
                this.validator.signup.basic,
                this._checkUserExist,
                this._passwordHandler,
                this._saveUser
            ],
            facebook: [
                this.validator.signup.facebook,
                this._getFbUser,
                this._checkFbUserExist,
                this._saveUser
            ]
        };

        if (!strategies[req.params.action]) {
            const error = new Error();
            error.status = 404;
            return next(error);
        }

        const operations = strategies[req.params.action].map((middleware) => {
            return middleware.bind(this, req, res);
        });

        require('async').series(operations, next);
    }

    /**
     * check if user exist api
     * @param req
     * @param res
     * @param next
     * @private
     */
    _checkUserExist(req, res, next) {
        Models.users.find(
            {
                where: {
                    email: req.body.email
                }
            }
        ).then(
            function (user) {
                if (user) {
                    let error = new Error();
                    error.message = 'User with this email already registered!';
                    error.status = 409;
                    return next(error);
                }
                req.local = {
                    email: req.body.email,
                    password: req.body.password,
                    name: req.body.name,
                    role: Models.users.ROLE.USER,
                };
                next()

            }
        )
    }

    /**
     * Password handler
     * @param req
     * @param res
     * @param next
     * @returns {*}
     * @private
     */
    _passwordHandler(req, res, next) {

        if (req.body.password !== req.body.confirmPassword) {
            let error = new Error();
            error.message = 'Passwords do not match!';
            error.status = 400;
            return next(error);
        }

        req.local.password = Password.hash(req.local.password);

        next();
    }

    /**
     * Crete new user
     * @param req
     * @param res
     * @param next
     * @private
     */
    _saveUser(req, res, next) {
        Models.users.create(req.local)
            .then(function (client) {
                res.send(Controller._createUserToken(Models.users.format.base(client)));
            })
            .catch(next);
    }

    /**
     * get user data from facebook
     * @param req
     * @param res
     * @param next
     * @private
     */
    _getFbUser (req, res, next) {
        Facebook.getUser(req.body.accessToken, function (err, user) {
            if (err) {
                return next(err);
            }

            user.role = Models.users.ROLE.USER;
            req.local = user;
            next();
        })
    }

    /**
     * check if user with current facebook id is registered
     * @param req
     * @param res
     * @param next
     * @private
     */
    _checkFbUserExist(req, res, next) {
        Models.users.findOne({
                where: {
                    facebookId: req.local.facebookId
                }
            })
            .then(function (user) {
                if (user) {
                    return res.send(Controller._createUserToken(Models.users.format.base(user)));
                }

                next();
            })
            .catch(next);
    }
}

module.exports = SignupController;
