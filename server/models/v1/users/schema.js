"use strict";

module.exports = function(sequelize, DataTypes){
    return {
        name: {
            type: DataTypes.STRING,
            field: 'name'
        },
        email: {
            type: DataTypes.STRING,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING
        },
        role: {
            type: DataTypes.INTEGER
        },
        facebookId: {
            type: DataTypes.STRING,
            field: 'facebook_id'
        },
        createdAt: {
            type: DataTypes.DATE,
            field: 'created_at'
        },
        updatedAt: {
            type: DataTypes.DATE,
            field: 'updated_at'
        }
    }
};
