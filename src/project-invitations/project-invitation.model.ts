import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/database';

class ProjectInvitation extends Model {
  public id!: number;
  public creatorId: number;
  public projectId!: number;
  public userId!: number;
  public token!: string;
  public expiry: Date;
}

ProjectInvitation.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    creatorId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'creator_id',
      references: {
        model: 'User',
        key: 'id',
      },
    },
    projectId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'project_id',
      references: {
        model: 'Project',
        key: 'id',
      },
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'user_id',
      references: {
        model: 'User',
        key: 'id',
      },
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expiry: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: 'project_invitations',
    modelName: 'ProjectInvitation',
    sequelize,
    timestamps: true,
  },
);

export default ProjectInvitation;
