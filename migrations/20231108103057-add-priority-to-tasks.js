'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('tasks', 'priority', {
      type: Sequelize.ENUM,
      values: ['NO_PRIORITY', 'URGENT', 'HIGH', 'MEDIUM', 'LOW'],
      defaultValue: 'NO_PRIORITY',
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('tasks', 'priority');
  },
};
