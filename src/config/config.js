module.exports = {
  secret: process.env.JWT_SECRET,
  validity: process.env.TOKEN_VALIDITY,
  nodeEnv: process.env.NODE_ENV,
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
  dbUrl: process.env.DB_URL,
};
