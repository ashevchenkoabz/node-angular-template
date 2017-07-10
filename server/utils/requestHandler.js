const fs = require('fs');
const logger = require('./logger');
const path = require('path');

module.exports = function (req, res, next) {
    if (process.env.NODE_ENV === 'test') {
        return next();
    }

    fs.stat(path.resolve(__dirname + '/..' + req.url), function (err, stats) {
        const isFile = stats && stats.isFile();
        //if static file just use next()
        if (!err && isFile) {
            next();
        } else {
            logger.log('info', 'request', {
                headers: req.headers,
                method: req.method,
                url: req.url,
                ip: req.ip
            });

            // Time the request
            const start = new Date();

            // due to res.on('header', ...) is deprecated in express 4.*
            // we use module 'on-headers'
            require('on-headers')(res, function () {
                const end = new Date();
                logger.log('info', 'response time', {
                    start: start.getTime(),
                    end: end.getTime(),
                    duration: end.getTime() - start.getTime(),
                    req: {
                        method: req.method,
                        url: req.url,
                        ip: req.ip
                    }
                });
            });

            next();
        }
    })
};
