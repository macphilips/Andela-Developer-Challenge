export default {
  secret: process.env.JWT_SECRET,
  validity: parseInt(process.env.TOKEN_VALIDITY, 10),
  nodeEnv: process.env.NODE_ENV || 'dev',
  dbUrl: (process.env.TEST_DB_URL && process.env.NODE_ENV === 'test') ? process.env.TEST_DB_URL : process.env.DB_URL,
  cors: {
    allowedHeaders: 'X-Access-Token,Content-Type',
    exposedHeaders: 'X-Access-Token,Content-Type',
  },
};
