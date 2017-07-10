'use strict';
const Base = require('./../../utils/baseValidator');
const validator = require('./../../utils/bodyValidator');
const Models = require('../../models/v1');

const userRoles = Models.users.ROLE;

class SignupValidator extends Base{

    static basic (req, res, next){
        return validator({
            properties: {
                password: {
                    pattern: /^[^\s]+$/,
                    required: true,
                    allowEmpty: false,
                    type: 'string',
                    minLength: 8,
                    maxLength: 30
                },
                confirmPassword: {
                    required: true,
                    allowEmpty: false,
                    type: 'string',
                    minLength: 8,
                    maxLength: 30
                },
                email: {
                    required: true,
                    allowEmpty: false,
                    type: 'string',
                    format: 'email',
                    minLength: 5,
                    maxLength: 100,
                    messages: {
                        format: 'Invalid email'
                    }
                },
                name: {
                    required: true,
                    allowEmpty: false,
                    type: 'string',
                    minLength: 5
                }
            }
        })(req, res, next);
    };

    static facebook (req, res, next){
        return validator({
            properties: {
                accessToken: {
                    required: true,
                    allowEmpty: false,
                    type: 'string',
                }
            }
        })(req, res, next);
    };

}
module.exports = SignupValidator;
