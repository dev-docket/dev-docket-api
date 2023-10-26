import { DataTypes, Model } from 'sequelize';
import sequelize from 'src/db/database';

class TaskActivity extends Model {
  id!: number;
  userId!: number;
  taskId!: number;
  description!: string;
  createdAt!: Date;
  isAutoActivity: boolean;
}

TaskActivity.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id',
      references: {
        model: 'User',
        key: 'id',
      },
    },
    taskId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'task_id',
      references: {
        model: 'Task',
        key: 'id',
      },
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'created_at',
    },
    isAutoActivity: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_auto_activity',
    },
  },
  {
    sequelize: sequelize,
    modelName: 'TaskActivity',
    tableName: 'tasks_activity',
    timestamps: false,
  },
);

export default TaskActivity;
