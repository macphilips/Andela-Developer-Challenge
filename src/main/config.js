module.exports = {
  secret: process.env.JWT_SERCRET || '3c4d6ee9b1a6904205d2249fcefbef02e350b851',
  validity: process.env.TOKEN_VALIDITY || 86400, // expires in 24 hours,
};
