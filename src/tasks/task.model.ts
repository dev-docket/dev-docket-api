import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/database';

class Task extends Model {
  public id!: number;
  public name!: string;
  public description: string;
  public status: string;
  public teamId!: number;
}

Task.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('TODO', 'IN_PROGRESS', 'DONE'),
      allowNull: true,
      defaultValue: 'TODO',
    },
    teamId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'team_id',
      references: {
        model: 'team',
        key: 'id',
      },
    },
  },
  {
    modelName: 'task',
    tableName: 'tasks',
    sequelize,
    timestamps: false,
  },
);

export default Task;
