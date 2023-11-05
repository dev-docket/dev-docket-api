import { Model, DataTypes } from 'sequelize';
import sequelize from '../db/database';
import { Exclude } from 'class-transformer';

class User extends Model {
  id!: number;
  email!: string;
  username: string;
  isProfileCompleted!: boolean;

  @Exclude()
  password!: string;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    username: {
      type: new DataTypes.STRING(128),
      allowNull: true,
    },
    password: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    isProfileCompleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_profile_completed',
    },
  },
  {
    tableName: 'users',
    modelName: 'User',
    sequelize,
    timestamps: false,
  },
);

export default User;
