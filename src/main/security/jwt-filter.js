import jwt from 'jsonwebtoken';
import TokenProvider from './jwt-provider';
import Builder from '../util/ant-matcher';

function doFilter(req, res, next) {
  const antPathMatcher = new Builder().create();
  const url = req.originalUrl;
  if (antPathMatcher.isMatch('/api/v1/account/register', url)
    || antPathMatcher.isMatch('/api/v1/authenticate', url)) {
    return next();
  }
  if (antPathMatcher.isMatch('/api/v1/**', url)) {
    const token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (!token) {
      return res.status(401).send({ auth: false, message: 'No token provided.' });
    }
    // verifies secret and checks exp
    try {
      const decoded = TokenProvider.validateToken(token);
      req.userId = decoded.id;
      return next();
    } catch (err) {
      return res.status(401).send({ auth: false, message: err.message });
    }
  }
  return next();
}

module.exports = doFilter;
