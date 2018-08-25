const commonConfig = require('./webpack.common');

module.exports = commonConfig({env: 'prod', apiUrl: 'https://shielded-waters-94006.herokuapp.com'});
