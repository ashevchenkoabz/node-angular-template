"use strict";

module.exports = function () {
    function base(data) {
        function userStructure(item) {
            item = item.dataValues;
            return {
                id: item.id,
                email: item.email,
                name: item.name,
                role: item.role,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt,
                token: item.token,
                tokenExpiresAt: item.tokenExpiresAt
            }
        }

        // when data - array with models
        if (Array.isArray(data)) {
            let result = data.map(function (user) {
                return userStructure(user);
            });

            return result;
        }

        return userStructure(data);
    }

    return {
        base: base
    }
};
