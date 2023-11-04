import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/database';

class AssignedUser extends Model {
  public id!: number;
  public taskId!: number;
  public userId!: number;
}

AssignedUser.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    taskId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'task_id',
      references: {
        model: 'task',
        key: 'id',
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id',
      references: {
        model: 'user',
        key: 'id',
      },
    },
  },
  {
    tableName: 'assigned_user',
    sequelize,
    timestamps: false,
  },
);

export default AssignedUser;
