module.exports = {
  app: {
    openapi: {
      servers: 'APP_OPENAPI_SERVERS'
    },
    auth: {
      jwtIntrospectEndpoint: 'FINAI_TOKEN_INTROSPECT_URL'
    }
  },
  redis: {
    url: 'FINAI_REDIS_URL',
    username: 'FINAI_REDIS_USERNAME',
    password: 'FINAI_REDIS_PASSWORD'
  },
  server: {
    host: 'APP_SERVER_HOST',
    port: 'APP_SERVER_PORT'
  },
  database: {
    host: 'AWS_RDS_DB_HOST',
    port: 'AWS_RDS_DB_PORT',
    username: 'AWS_RDS_DB_USERNAME',
    password: 'AWS_RDS_DB_PASSWORD'
  },
  logger: {
    directory: 'APP_LOG_DIR',
    filename: `APP_LOG_FILENAME`,
    level: 'APP_LOG_LEVEL',
    maxLogSize: 'APP_LOG_MAX_SIZE',
    backups: 'APP_LOG_MAX_BACKUPS'
  }
};
