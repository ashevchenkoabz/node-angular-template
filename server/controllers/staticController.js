const fs = require('fs');
const config = require('../../config');
const _ = require('lodash');
const async = require('async');

function renderStaticHtmlFile (path) {
    return function (req, res, next) {
        fs.createReadStream(__dirname + '/../../frontend/' + path)
            .pipe(res);
    }
}

function swaggerConfig (req, res, next) {
    const base = require('./../../frontend/swagger/api.json');
    const apiDir = require('path').resolve(__dirname + '/../../frontend/swagger/api');
    const parts = fs.readdirSync(apiDir);

    async.each(parts, function (filename, cb) {
        const part = require(apiDir + '/' + filename);
        base.tags.concat(part.tags);
        base.paths = _.extend(base.paths, part.paths)
        base.definitions = _.extend(base.definitions, part.definitions)
        cb();
    }, function (err) {
        res.send(base);
    })
}

module.exports = {
    admin: renderStaticHtmlFile('admin/index.html'),
    swaggerConfig: swaggerConfig
};
