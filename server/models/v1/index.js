"use strict";

const fs        = require("fs");
const path      = require("path");
const sequelize = require("./../../utils/sequelize");
const db        = {};

fs
    .readdirSync(__dirname)
    .filter(function(file) {
        return fs.statSync(path.join(__dirname, file)).isDirectory();
    })
    .forEach(function(file) {

        let pathToModel = path.join(__dirname, file);
        let methods = require(pathToModel + '/methods');
        let format = require(pathToModel + '/format');
        let schema = require(pathToModel + '/schema');

        methods.classMethods.__defineGetter__('format', format);

        let model = sequelize.importCache[path] = sequelize.define(file, schema(sequelize, sequelize.Sequelize), methods);

        db[model.name] = model;
    });

    Object.keys(db).forEach(function(modelName) {
        if ("associate" in db[modelName]) {
            db[modelName].associate(db);
        }
    });

module.exports = db;
