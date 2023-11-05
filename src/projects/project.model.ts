import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/database';

class Project extends Model {
  public id!: number;
  public name!: string;
  public slug!: string;
}

Project.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    slug: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
  },
  {
    tableName: 'projects',
    modelName: 'Project',
    sequelize,
    timestamps: false,
  },
);

export default Project;
