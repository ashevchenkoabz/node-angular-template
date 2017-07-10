'use strict';

const Controller = require('./../../utils/controller');
const SignupController = require('./signupController');
const Models = require('./../../models/v1');
const Password = require('./../../helpers/password');

class SigninController extends Controller {
    constructor (version) {
        super(version);

        this.signin = [this._chooseStrategy];
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
        const signUpController = new SignupController(this.VERSION);
        const strategies = {
            basic: [
                this.validator.signin.basic,
                this._checkUserExist,
                this._authenticate,
            ],
            facebook: [signUpController._chooseStrategy]
        };

        if (!strategies[req.params.action]) {
            const error = new Error();
            error.status = 404;
            return next(error);
        }

        const self = req.params.action === 'facebook' ? signUpController : this;

        const operations = strategies[req.params.action].map((middleware) => {
            return middleware.bind(self, req, res);
        });

        require('async').series(operations, next);
    }

    /**
     * check if user exist with current email
     * @param req
     * @param res
     * @param next
     * @private
     */
    _checkUserExist (req, res, next) {
        Models.users.findOne({
            where: {
                email: req.body.email
            }
        }).then(function (result) {
            if (!result) {
                let error = new Error();
                error.message = "User with this email does not exist";
                error.status = 404;
                return next(error);
            }

            res.locals.user = result;
            next();
        })
        .catch(next);
    }


    /**
     * authenticate user using password
     * @param req
     * @param res
     * @param next
     * @private
     */
    _authenticate (req, res, next){
        if (!Password.compare(req.body.password, res.locals.user.password)) {
            let error = new Error();
            error.message = "Password does not match";
            error.status = 401;
            return next(error);
        }

        res.send(Controller._createUserToken(Models.users.format.base(res.locals.user)));
    }
}

module.exports = SigninController;
