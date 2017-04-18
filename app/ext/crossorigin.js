exports = module.exports = function() {
  return require('oauth2orize-crossorigin').extensions();
};

exports['@implements'] = 'http://schemas.authnomicon.org/js/aaa/oauth2/request/parameters';
exports['@name'] = 'cross-origin';
