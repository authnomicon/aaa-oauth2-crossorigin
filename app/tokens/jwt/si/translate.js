exports = module.exports = function() {
  
  return function translate(ctx, options, cb) {
    var claims = {};
    
    if (ctx.user) {
      claims.sub = ctx.user.id;
    }
    if (ctx.client) {
      // https://tools.ietf.org/html/draft-ietf-oauth-token-exchange-07#section-4.3
      claims.cid = ctx.client.id;
    }
    if (ctx.csrfToken) {
      // https://tools.ietf.org/html/draft-bradley-oauth-jwt-encoded-state-07
      claims.rfp = ctx.csrfToken;
    }
    
    return cb(null, claims);
  };
};

exports['@implements'] = 'http://i.bixbyjs.org/tokens/translateContextFunc';
exports['@dialect'] = 'http://schemas.authnomicon.org/aaa/tokens/jwt/si-token';
