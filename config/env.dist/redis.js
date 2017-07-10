module.exports = {
    host: '127.0.0.1',
    port: '6379',
    options: {
        retry_max_delay: 1000,
        max_attempts: 10
    }
};