var db = require('./../config')[process.env.NODE_ENV];

module.exports = {
    host: process.env.DB_HOST || db.host,
    port: parseInt(process.env.DB_PORT) || 3306,
    dbname: process.env.DB_NAME || db.database,
    user: process.env.DB_USER || db.username,
    password: process.env.DB_PASSWORD || db.password,
    charset: 'utf8mb4',
    connectionRetryCount: 5,
    maxConnections: 10,
    delayBeforeReconnect: 3000,
    showErrors: true
};
