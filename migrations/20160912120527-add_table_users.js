'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.createTable(
        'users',
        {
          id: {
            type: Sequelize.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
          },
          name: {
            type: Sequelize.STRING,
            field: 'name',
            allowNull: false,
          },
          email: {
            type: Sequelize.STRING,
            allowNull: false
          },
          password: {
            type: Sequelize.STRING,
            allowNull: true
          },
          role: {
            type: Sequelize.INTEGER,
            defaultValue: 1,
            allowNull: false
          },
          facebookId: {
            type: Sequelize.STRING,
            field: 'facebook_id',
            allowNull: true
          },
          createdAt: {
            type: Sequelize.DATE,
            field: 'created_at'
          },
          updatedAt: {
            type: Sequelize.DATE,
            field: 'updated_at'
          }
        })
        .then(function () {
          queryInterface.addIndex(
              'users',
              ['email'],
              {
                indexName: 'idxUserEmail',
                indicesType: 'UNIQUE'
              }
          )
        })
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.dropTable('users')
  }
};
