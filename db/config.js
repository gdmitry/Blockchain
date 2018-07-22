module.exports = {
  development: {
    username: 'root',
    password: '1234',
    database: 'coin-db',
    host: '127.0.0.1',
    dialect: 'mysql'
  },
  test: {
    username: 'root',
    password: '123',
    database: 'coin-db',
    host: '127.0.0.1',
    dialect: 'mysql',
    logging: false,
    port: 3307
  },
  production: {
    username: 'root',
    password: '123',
    database: 'coin-db',
    host: '127.0.0.1',
    dialect: 'mysql'
  }
};
