'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('tasks', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING(128),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true, // allowNull: true if the description is optional
      },
      status: {
        type: Sequelize.ENUM('TODO', 'IN_PROGRESS', 'DONE'),
        defaultValue: 'TODO',
        allowNull: true, // allowNull: true allows the task to not have a status set, which will default to 'TODO'
      },
      team_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'teams',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL', // or 'CASCADE' or 'RESTRICT', depending on your business logic
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('tasks');
  },
};
