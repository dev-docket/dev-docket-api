import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/database';

class ProjectMember extends Model {
  public projectId!: number;

  public userId!: number;

  public role!: string;
}

ProjectMember.init(
  {
    projectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'project_id',
      references: {
        model: 'Project',
        key: 'id',
      },
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
    role: {
      type: DataTypes.STRING,
      allowNull: false,

      validate: {
        isIn: [['owner', 'member']],

        notEmpty: true,

        notNull: true,

        len: [1, 50],
      },
    },
  },
  {
    sequelize,
    modelName: 'ProjectMember',
    tableName: 'project_members',
    timestamps: false,
  },
);

ProjectMember.removeAttribute('id');

export default ProjectMember;
