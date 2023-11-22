import { Sequelize } from 'sequelize';
import config from '../config/config';

const env = process.env.NODE_ENV || 'development';

console.log(env);
const { username, password, database, host, port } = config[env];

let sequelize;

if (env === 'production') {
  sequelize = new Sequelize(database, username, password, {
    host,
    port,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  });
} else {
  sequelize = new Sequelize(database, username, password, {
    host,
    port,
    dialect: 'postgres',
  });
}

export default sequelize;
