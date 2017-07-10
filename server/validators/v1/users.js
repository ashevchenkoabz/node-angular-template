'use strict';
const Base = require('./../../utils/baseValidator');
const validator = require('./../../utils/bodyValidator');

class UsersValidator extends Base{

    static list (req, res, next){
        return validator({
            properties: {
                q: {
                    type: 'string',
                    allowEmpty: true,
                    required: false
                },
                offset: {
                    type: 'any',
                    allowEmpty: true,
                    required: false
                },
                limit: {
                    type: 'any',
                    allowEmpty: true,
                    required: false
                },
                order_field: {
                    type: 'string',
                    allowEmpty: false,
                    required: false
                },
                order_type: {
                    type: 'string',
                    allowEmpty: false,
                    required: false,
                    enum: ['asc', 'desc', 'ASC', 'DESC']
                }
            }
        })(req, res, next);
    };

    static add (req, res, next){
        return validator({
            properties: {
                name: {
                    type: 'string',
                    allowEmpty: false,
                    required: true
                },
                email: {
                    type: 'any',
                    allowEmpty: false,
                    required: true,
                    format: 'email'
                },
                password: {
                    type: 'any',
                    allowEmpty: false,
                    required: true
                }
            }
        })(req, res, next);
    };

    static edit (req, res, next){
        return validator({
            properties: {
                name: {
                    type: 'string',
                    allowEmpty: false,
                    required: true
                },
                email: {
                    type: 'any',
                    allowEmpty: false,
                    required: true,
                    format: 'email'
                },
                password: {
                    type: 'any',
                    allowEmpty: false,
                    required: true
                }
            }
        })(req, res, next);
    };


}
module.exports = UsersValidator;
