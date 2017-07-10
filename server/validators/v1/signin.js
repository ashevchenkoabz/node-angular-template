'use strict';
const Base = require('./../../utils/baseValidator');
const validator = require('./../../utils/bodyValidator');

class SigninValidator extends Base{
    static basic (req, res, next){
        return validator({
            properties: {
                password: {
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
                }
            }
        })(req, res, next);
    };
}

module.exports = SigninValidator;
