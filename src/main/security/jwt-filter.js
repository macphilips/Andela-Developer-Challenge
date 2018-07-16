import TokenProvider from './jwt-provider';

function doFilter(req, res, next) {
  const token = req.body.token || req.query.token || req.headers['x-access-token'];
  const url = req.originalUrl;
  if (!token) {
    return res.status(403).send({auth: false, message: 'No token provided.'});
  }
  // verifies secret and checks exp
  TokenProvider.validateToken(token, (err, decoded) => {
    if (err) {
      return res.status(500).send({auth: false, message: err.message});
    }
    // if everything is good, save to request for use in other routes
    req.userId = decoded.id;
    return next();
  });
}

module.exports = doFilter;
