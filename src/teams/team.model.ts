import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/database';

export class Team extends Model {
  id: number;
  name: string;
  projectId: number;
}

Team.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    projectId: {
      type: DataTypes.INTEGER,
      field: 'project_id',
      references: {
        model: 'project',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'team',
    tableName: 'teams',
    timestamps: false,
  },
);
