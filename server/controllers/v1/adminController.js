'use strict';

const Controller = require('./../../utils/controller');
const Password = require('./../../helpers/password');
const Models = require('./../../models/v1');

class AdminController extends Controller {
    constructor (version) {
        super(version);

        this.login = [this._findUser, this._loginAdmin]
    }

    /**
     *
     * @param req
     * @param res
     * @param next
     * @private
     */
    _findUser (req, res, next) {
        Models.users
            .findOne({
                email: req.body.email
            })
            .then(function (user) {
                if (!user) {
                    let error = new Error();
                    error.message = "User does not exist";
                    error.status = 404;
                    return next(error);
                }

                res.locals.user = user;
                next();
            })
            .catch(next);
    }

    /**
     * start admin session
     * @param req
     * @param res
     * @param next
     * @private
     */
    _loginAdmin (req, res, next) {
        if (!Password.compare(req.body.password, res.locals.user.password)) {
            let error = new Error();
            error.message = "Password does not match";
            error.status = 401;
            return next(error);
        }

        res.send(Controller._createUserToken(Models.users.format.base(res.locals.user)));
    }
}

module.exports = AdminController;
