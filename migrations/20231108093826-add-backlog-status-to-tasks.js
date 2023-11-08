'use strict';

module.exports = {
  up: async (queryInterface) => {
    // Define the SQL command to add a new enum value
    const sql = "ALTER TYPE enum_tasks_status ADD VALUE 'BACKLOG';";
    await queryInterface.sequelize.query(sql);
  },

  down: async (queryInterface) => {
    // The down migration is more complex because PostgreSQL doesn't support removing enum values directly.
    // You would need to create a new enum type and update the column to use the new enum.
    // Here is a simplified version; in reality, you would also need to handle existing data appropriately.

    // Create a backup enum type with the original values
    const sqlCreateBackupEnum = `CREATE TYPE enum_tasks_status_backup AS ENUM('TODO', 'IN_PROGRESS', 'DONE');`;
    await queryInterface.sequelize.query(sqlCreateBackupEnum);

    // Update the column to use the backup enum
    const sqlAlterColumn = `ALTER TABLE "tasks" ALTER COLUMN "status" TYPE enum_tasks_status_backup USING "status"::text::enum_tasks_status_backup;`;
    await queryInterface.sequelize.query(sqlAlterColumn);

    // Remove the old enum type
    const sqlDropOldEnum = `DROP TYPE enum_tasks_status;`;
    await queryInterface.sequelize.query(sqlDropOldEnum);

    // Rename the backup enum type to the original name
    const sqlRenameEnum = `ALTER TYPE enum_tasks_status_backup RENAME TO enum_tasks_status;`;
    await queryInterface.sequelize.query(sqlRenameEnum);
  },
};
