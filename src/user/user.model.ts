import { Model, DataTypes } from 'sequelize';
import sequelize from '../db/database';
import { Exclude } from 'class-transformer';

class User extends Model {
  public id!: number;
  public email!: string;

  @Exclude()
  password!: string;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    password: {
      type: new DataTypes.STRING(128),
      allowNull: false,
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
