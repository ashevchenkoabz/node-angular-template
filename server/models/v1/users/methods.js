"use strict";

module.exports = {
    classMethods: {
        associate: function (models) {

        },
        get ROLE() {
            return {
                USER: 1,
                ADMIN: 2
            }
        }
    },
    scopes: {
        role: (role) => {
            return {
                where: {
                    role: role
                }
            }
        },
        defaultAttributesSet: {
            attributes:['id', 'name', 'email', 'role', 'createdAt']
        }
    }
};
