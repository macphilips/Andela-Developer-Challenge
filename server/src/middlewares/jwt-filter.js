import { validateToken } from './jwt-provider';
import Builder from '../functions/ant-matcher';

export default function doFilter(req, res, next) {
  const antPathMatcher = new Builder().create();
  const url = req.originalUrl;
  if (antPathMatcher.isMatch('/api/v1/account/register', url)
    || antPathMatcher.isMatch('/api/v1/authenticate', url)) {
    return next();
  }
  if (antPathMatcher.isMatch('/api/v1/**', url)) {
    // const token = req.body.token || req.query.token || req.headers['x-access-token'];
    Promise.resolve(req.body.token || req.query.token || req.headers['x-access-token'])
      .then((token) => {
        let promise = null;
        if (!token) {
          promise = Promise.reject(new Error('No token provided.'));
        } else {
          // verifies secret and checks exp
          try {
            promise = validateToken(token);
          } catch (err) {
            promise = Promise.reject(new Error('Invalid Token'));
          }
        }
        return promise;
      }).then((decoded) => {
        req.userId = parseInt(decoded.id, 10);
        next();
      }).catch((err) => {
        res.status(401).send({ auth: false, message: err.message });
      });
    return null;
  }
  return next();
}
