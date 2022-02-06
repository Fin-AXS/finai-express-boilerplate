const package = require('../../package.json');

module.exports = {
  app: {
    openapi: {
      servers: 'localhost'
    },
    auth: {
      jwtIntrospectEndpoint: ''
    }
  },
  redis: {
    url: '',
    username: '',
    password: ''
  },
  server: {
    host: 'localhost',
    port: '9701'
  },
  database: {
    host: '',
    port: 5432,
    username: '',
    password: ''
  },
  logger: {
    directory: './logs',
    filename: `${package.name}.log`,
    level: 'info',
    maxLogSize: 1073741824,
    backups: 5
  }
};
