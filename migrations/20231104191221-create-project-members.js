'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('project_members', {
      // Definicja kolumny projectId jako klucz obcy
      project_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'projects', // Nazwa tabeli docelowej
          key: 'id', // Klucz, do którego odwołuje się klucz obcy
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      // Definicja kolumny userId jako klucz obcy
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users', // Nazwa tabeli docelowej
          key: 'id', // Klucz, do którego odwołuje się klucz obcy
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      // Definicja kolumny role
      role: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          isIn: [['owner', 'member']],
        },
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('project_members');
  },
};
