"use strict";

const express = require('express');
const bodyParser = require('body-parser');
const errorHandler = require('./utils/errorHandler');
const disallowMethods = require('./utils/methodsHandler');
const requestHandler = require('./utils/requestHandler');
const router = require('./routes');
const cors = require('cors');
const controllers = require('./controllers');

//initialize the app
const app = module.exports = express();
app.use(cors());

//set up static files directory
app.use(express.static(__dirname + '/../frontend'));
app.use(requestHandler);
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.raw({limit: '50mb'}));
app.use(bodyParser.urlencoded({extended: true}));

app.use('/api', router.api);
app.use('/admin', router.admin);
app.use(router.general);


//set up http error handler
app.use(errorHandler(app));

disallowMethods(app);
