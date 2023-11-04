'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      email: {
        type: Sequelize.STRING(128),
        allowNull: false,
      },
      username: {
        type: Sequelize.STRING(128),
        allowNull: true,
      },
      password: {
        type: Sequelize.STRING(128),
        allowNull: false,
      },
      is_profile_completed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      // Dodaj tutaj dodatkowe pola
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('users');
  },
};
