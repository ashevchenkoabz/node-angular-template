'use strict';

const Controller = require('./../../utils/controller');
const Models = require('./../../Models/v1');
const Password = require('./../../helpers/password');

class UsersController extends Controller {
    constructor (version) {
        super(version);

        this.getById = [this._getById];

        this.getList = [this.validator.users.list, this.validateLimits, this._buildFilters, this._getList];
        this.add = [this.validator.users.add, this._addUser];
        this.edit = [this.validator.users.edit, this._checkUser, this._editUser];
        this.delete = [this._delete];
    }


    /**
     * return user data by id
     * @param req
     * @param res
     * @param next
     * @private
     */
    _getById (req, res, next) {
        let id = req.params.id == 'me' ? req.user.id : req.params.id;
        Models.users.findById(id)
            .then(function (user) {
                if (!user) {
                    let error = new Error();
                    error.message = "User not found";
                    error.status = 404;
                    return next(error);
                }

                res.send(Models.users.format.base(user));
            })
            .catch(next);
    }

    /**
     * build filters for getting users
     * @param req
     * @param res
     * @param next
     * @private
     */
    _buildFilters (req, res, next) {
        const config = {
            where: {
                id: {$ne: req.user.id}
            },
            limit: req.query.limit,
            offset: req.query.offset,
        };

        if (req.query.q) {
            config.where.$or = [
                {email: {$like: '%' + req.query.q + '%'}},
                {name: {$like: '%' + req.query.q + '%'}}
            ]
        }

        config.order = [['name', 'ASC']];

        if (req.query.order_field) {
            req.query.order_type = req.query.order_type || 'ASC';
            config.order = [[req.query.order_field, req.query.order_type]]
        }

        res.locals.config = config;
        next();
    }

    /**
     * get list of users with filters
     * @param req
     * @param res
     * @param next
     * @private
     */
    _getList (req, res, next) {
        const response = {total: 0, items: []};

        Models.users
            .scope('defaultAttributesSet', {method: ['role', Models.users.ROLE.USER]})
            .findAndCountAll(res.locals.config)
            .then(function (result) {
                response.total = result.count;
                response.items = result.rows;

                res.send(response);
            })
            .catch(next);
    }


    /**
     * add new user
     * @param req
     * @param res
     * @param next
     * @private
     */
    _addUser (req, res, next) {
        const params = {
            email: req.body.email,
            name: req.body.name,
            role: Models.users.ROLE.USER,
            password: Password.hash(req.body.password)
        };

        Models.users.create(params)
            .then(function (user) {
                res.locals.user = user;
                res.status(201)
                    .send(Models.users.format.base(user))
            })
            .catch(next);
    }

    _editUser (req, res, next) {
        const params = {};

        if (req.body.email) {params.email = req.body.email}
        if (req.body.name) {params.name = req.body.name}
        if (req.body.password) {params.password = Password.hash(req.body.password)}

        Models.users.update(params, {
            where: {
                id: req.params.id
            }
        })
            .then(function (user) {
                res.status(200)
                    .send()
            })
            .catch(next);
    }

    /**
     * delete user account
     * @param req
     * @param res
     * @param next
     * @private
     */
    _delete (req, res, next) {
        Models.users.destroy({
            where: {
                id: req.params.id
            }
        }).then(function () {
            res.status(204);
            res.send();
        }).catch(next);
    }

    /**
     * check if user exists
     * @param req
     * @param res
     * @param next
     * @private
     */
    _checkUser (req, res, next) {
        Models.users.findById(req.params.id)
            .then(function (data) {
                if (!data) {
                    let error = new Error();
                    error.message = "User does not exist";
                    error.status = 404;
                    return next(error);
                }

                res.locals.user = data;
                next();
            })
            .catch(next);
    }
}

module.exports = UsersController;
