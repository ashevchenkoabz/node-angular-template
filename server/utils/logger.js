const winston = require('winston');
const config = require('winston/lib/winston/config');

const logger = new (winston.Logger)({
    levels: {
        error: 0,
        input: 1,
        verbose: 2,
        prompt: 3,
        debug: 4,
        info: 5,
        data: 6,
        help: 7,
        warn: 8,
    },
    colors: {
        error: 'red',
        input: 'grey',
        verbose: 'cyan',
        prompt: 'grey',
        debug: 'blue',
        info: 'green',
        data: 'grey',
        help: 'cyan',
        warn: 'yellow',
    },
    transports: [
        new (winston.transports.Console)({
            timestamp: function () {
                return new Date().toISOString();
            },
            colorize: true,
            formatter: function (options) {
                let meta = '';
                if (options.meta && Object.keys(options.meta).length) {
                    delete options.meta.stack;
                    meta = JSON.stringify(options.meta);
                }


                return '[' +  config.colorize(options.level, options.timestamp()) +'] - ' +
                    config.colorize(options.level, options.level.toUpperCase()) +': '
                    + (undefined !== options.message ? options.message : '') + ' ' +
                    meta;
            }
        })
    ],
    exitOnError: false,
    exceptionHandlers: [
        new (winston.transports.Console)({
            timestamp: function () {
                return new Date().toISOString();
            },
            colorize: true,
            formatter: function (options) {
                return '[' + config.colorize(options.level, options.timestamp()) + '] - ' +
                    config.colorize(options.level, options.level.toUpperCase()) + ': '+
                    (undefined !== options.message ? options.message : '') +
                    (options.meta && Object.keys(options.meta).length ? '\n\t'+ options.meta.stack.join('\n') : '')
            }
        })
    ],
});


module.exports = logger;
