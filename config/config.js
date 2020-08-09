require('dotenv').config();

module.exports = {
  development: {
    username: 'root',
    password: process.env.CLOTH_DEV,
    database: 'cloth',
    host: 'localhost',
    dialect: 'mysql'
  },
  production: {
    username: 'admin',
    password: process.env.CLOTH_DEP,
    database: 'cloth',
    host: 'otjang-server.czmmexcnherm.ap-northeast-2.rds.amazonaws.com',
    port: 13306,
    dialect: 'mysql'
  }
};