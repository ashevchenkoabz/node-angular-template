"use strict";
const SequelizeBase = require('sequelize');
const logger = require('./logger');
const config = require('./../../config');
let _instance = null;

class Sequelize {
    constructor () {
        if (!_instance) {
            _instance = new SequelizeBase(config.db.dbname, config.db.user, config.db.password, {
                host: config.db.host,
                dialect: 'mysql',
                pool: {
                    max: config.db.maxConnections,
                    min: 0,
                    idle: config.db.delayBeforeReconnect
                },
                logging: process.env.NODE_ENV === 'local' ? logger.help : false
            });

            _instance.Sequelize = SequelizeBase;
        }

        return _instance;
    }
}

module.exports = new Sequelize();