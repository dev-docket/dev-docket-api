'use strict';

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.renameTable('tasks_activity', 'task_activities');
  },

  down: async (queryInterface) => {
    await queryInterface.renameTable('task_activities', 'tasks_activity');
  },
};
