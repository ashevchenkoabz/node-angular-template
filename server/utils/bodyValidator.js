"use strict";
const revalidator = require('revalidator');

function createError(code, message) {
    const err = new Error();
    err.status = code;
    err.message = message;
    return err;
}

function getRequestBody(req) {
    switch (req.method) {
        case 'GET':
            return req.query || {};

        case 'POST':
        case 'PUT':
        case 'PATCH':
            return req.body || {};
        case 'DELETE':
            return req.query || {};
    }

    return false;
}

module.exports = function bodyValidator(schema) {
    return function (req, res, next) {
        if (schema) {
            const data = getRequestBody(req);
            if (!data) {
                let error = new Error();
                error.message = 'bodyValidator does not support ' + req.method + ' requests';
                error.status = 400;
                return next(error);
            } else {
                const result = revalidator.validate(data, schema);
                let message;
                if (!result.valid) {
                    if (schema.properties[result.errors[0].property] &&
                        schema.properties[result.errors[0].property].messages &&
                        schema.properties[result.errors[0].property].messages[result.errors[0].attribute]) {
                        message = result.errors[0].message
                    } else {
                        message = [
                            result.errors[0].property,
                            result.errors[0].message
                        ].join(' ');
                    }

                    let error = new Error();
                    error.message = message;
                    error.status = 400;
                    return next(error);

                } else {
                    next();
                }
            }
        } else {
            next();
        }
    }
};
