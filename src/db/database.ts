import { Sequelize } from 'sequelize';
import config from '../config/config';

const env = process.env.NODE_ENV || 'development';
const { username, password, database, host, port, dialect } = config[env];

const sequelize = new Sequelize(database, username, password, {
  host,
  port,
  dialect,
});

export default sequelize;
