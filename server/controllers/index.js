"use strict";

const async = require('async');
const fs = require('fs');
const path = require('path');
const versions = {};
const staticController = require('./staticController');

class ControllerManager {
    constructor (versions) {
        this.versions = versions;

        fs.readdirSync(__dirname)
            .filter(function(file) {
                return fs.statSync(path.join(__dirname, file)).isDirectory();
            })
            .forEach((item) => {
                this.versions[item] = {};
                fs.readdirSync(__dirname + '/' + item)
                    .forEach((controller) => {
                        versions[item][controller.split('Controller')[0]] = this._getController.apply(this, [controller.split('.')[0], item])
                    })
            });
    }
    
    get staticFiles () {
        return staticController
    }

    /**
     * requires a controller module from sub-directory
     * @param controller {string}
     * @param version {string}
     * @private
     */
    _getController (controller, version) {
        const Controller = require('./' + version + '/' + controller);
        return new Controller(version);
    }

    /**
     * calls specified method of controller
     * @param route {string}
     * @returns {Function}
     */
    callAction (route) {
        return function (req, res, next) {
            const version = req.params.version || 'v1';
            const error = new Error();
            if (!this.versions[version]) {
                error.message = 'Unsupported API version';
                error.status = 403;
                return next(error);
            }

            const controller = route.split('.')[0];
            const action = route.split('.')[1];
            if (!this.versions[version][controller]) {
                error.message = 'Controller not implemented';
                error.status = 405;
                return next(error);
            }

            if (!this.versions[version][controller][action]) {
                error.message = 'Action not implemented';
                error.status = 405;
                return next(error);
            }

            let operations = Array.isArray(this.versions[version][controller][action])
                ? this.versions[version][controller][action]
                : [this.versions[version][controller][action]];
            operations = operations.map((middleware) => {
                return middleware.bind(this.versions[version][controller], req, res);
            });

            async.series(operations, next);
        }.bind(this)
    }
}

module.exports = new ControllerManager(versions);
