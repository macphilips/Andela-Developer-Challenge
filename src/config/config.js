export default {
  secret: process.env.JWT_SECRET,
  validity: parseInt(process.env.TOKEN_VALIDITY, 10),
  nodeEnv: process.env.NODE_ENV || 'dev',
  cors: {
    origins: '*',
    methods: '*',
    allowedHeaders: '*',
    exposedHeaders: 'X-Access-Token',
    credentials: true,
    maxAge: 1800,
    securityOption: {
      permitAll: ['/api/v1/account/register*', '/api/v1/authenticate'],
      authenticated: ['/api/v1/**'],
    },
  },
  dbUrl: (process.env.TEST_DB_URL && process.env.NODE_ENV === 'test') ? process.env.TEST_DB_URL : process.env.DB_URL,
};
