import { DataTypes, Model } from 'sequelize';
import database from '../db/database';

class TeamMember extends Model {
  public teamId!: number;
  public userId!: number;
  public role!: string;
}

TeamMember.init(
  {
    teamId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'team_id',
      references: {
        model: 'team',
        key: 'id',
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'user_id',
      references: {
        model: 'user',
        key: 'id',
      },
    },
    role: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    tableName: 'team_members',
    modelName: 'teamMember',
    sequelize: database,
    timestamps: false,
  },
);

export default TeamMember;
