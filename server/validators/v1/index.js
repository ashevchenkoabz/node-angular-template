"use strict";

const fs        = require("fs");
const path      = require("path");

const Validator = {};

fs
    .readdirSync(__dirname)
    .filter(function(file) {
        return (file.indexOf(".") !== 0) && (file !== "index.js");
    })
    .forEach(function(file) {
        Validator[file.split('.')[0]] = require('./'+file)
    });


module.exports = Validator;

