var db = require('./db');
var redis = require('./redis');
var defaults = {
    server: {
        port: parseInt(process.env.PORT) || 8008,
        host: process.env.HOST || 'localhost',
        baseUrl: 'http://locahost:8008',
        https: {
            key: 'certificates/ssl/domain.key',
            cert: 'certificates/ssl/domain.crt',
            csr: 'certificates/ssl/domain.csr',
            port: parseInt(process.env.HHTPS_PORT) || 443,
        }
    },
    jwtKey: "some-string",
    jwtLifeTime: 1000 * 60 * 60 * 24,
    db: db,
    redis: redis
};


module.exports = defaults;
