"use strict";

const config = require('./config');
const logger = require('./server/utils/logger');
const app = require('./server');
const fs = require('fs');
const http = require('http');

const serverStartCallback = function () {
    logger.log('info', "Web server successfully started at port %d", config.server.port);
};

if (process.env.NODE_ENV === 'production') {
    let creadentials = {
        key: fs.readFileSync('./certificates/ssl/domain.key'),
        cert: fs.readFileSync('./certificates/ssl/domain.crt'),
        ca: [fs.readFileSync('./certificates/ssl/domain.csr')]
    };

    let server = require('https').createServer(creadentials, app)
        .listen(config.server.https.port, serverStartCallback)

    http.createServer(function (req, res) {
        res.writeHead(301, {"Location": `https://${req.headers['host']}${req.url}`});
        res.end();
    }).listen(config.server.port);
} else {
    let server = http.createServer(app)
        .listen(config.server.port, serverStartCallback)
}


