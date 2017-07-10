"use strict";
const FB = require('facebook-node');

class FacebookHelper {
    /**
     * returns user data from facebook
     * @param token {string}
     * @return {Promise}
     */
    static getUser (token, cb) {
        FB.setAccessToken(token);
        FB.api('/me',  { fields: ['email', 'first_name', 'last_name', 'id'] }, function (user) {
            if (!user || user.error) {
                return cb(user.error);
            }

            const newUser = {
                facebookId: user.id,
                email: user.id + '@facebook.com',
                name: user.first_name + ' ' + user.last_name,
            };

            cb(null, newUser);
        })
    }
}

module.exports = FacebookHelper;
