'use strict';
const redis = require('redis');
const config = require('./../../config');

let _instance = null;

class Redis {
    constructor() {
        this.attempt = 1;
        this.shouldDisconnect = false;
        const self = this;
        if(!_instance){
            _instance = redis.createClient({
                host: config.redis.host,
                port: config.redis.port,
                prefix: config.redis.options.prefix,
                max_attempts: config.redis.options.max_attempts
            });
            _instance.on('reconnecting', function (param) {
                self.attempt++;
                console.warn('Redis connection has not been established. Reconnecting... Attempt: %s ', param.attempt);
                if (self.attempt >= config.redis.options.max_attempts) {
                    self.shouldDisconnect = true;
                    const tm = setTimeout(function () {
                        if (self.shouldDisconnect) {
                            console.error('Web server is going to shut down. Disconnecting...');
                            process.exit(1);
                        } else {
                            clearTimeout(tm);
                            self.attempt = 1;
                        }
                    }, 3000)
                }
            });
            _instance.on('error', function (err) {
                console.error(err);
            });

            _instance.on('connect', function () {
                self.shouldDisconnect = false;
                self.attempt = 1;
                console.log('Redis successfully connected')
            });

        }

        return _instance;
    }
}

module.exports = new Redis();
