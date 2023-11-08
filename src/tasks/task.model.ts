import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/database';

class Task extends Model {
  public id!: number;
  public name!: string;
  public description: string;
  public status: string;
  public priority: string;
  public teamId!: number;
}

Task.init(
  {
    id: {
      type: DataTypes.INTEGER,
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
      type: DataTypes.ENUM('BACKLOG', 'TODO', 'IN_PROGRESS', 'DONE'),
      allowNull: true,
      defaultValue: 'TODO',
    },
    priority: {
      type: DataTypes.ENUM('NO_PRIORITY', 'URGENT', 'HIGH', 'MEDIUM', 'LOW'),
      allowNull: true,
      defaultValue: 'NO_PRIORITY',
    },
    teamId: {
      type: DataTypes.INTEGER,
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
