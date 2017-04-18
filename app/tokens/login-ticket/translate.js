exports = module.exports = function() {
  
  return function translate(ctx, options, cb) {
    var claims = {}
      , conf;
    
    if (ctx.user) {
      claims.sub = ctx.user.id;
    }
    if (ctx.client) {
      claims.azp = ctx.client.id;
    }
    
    if (ctx.csrfToken) {
      // https://tools.ietf.org/html/draft-bradley-oauth-jwt-encoded-state-07
      claims.rfp = ctx.csrfToken;
    }
    
    if (ctx.confirmation) {
      conf = ctx.confirmation;
      switch (conf.method) {
      case 'pkco':
        // TODO: nonce?
        claims.cnf = {};
        claims.cnf.co_origin = conf.origin;
        claims.cnf.co_challenge = conf.challenge;
        if (conf.transform && conf.transform !== 'none') { claims.cnf.co_challenge_method = conf.transform; }
        break;
      default:
        // TODO: throw error;
      }
    }
    
    return cb(null, claims);
  };
};

exports['@implements'] = 'http://i.bixbyjs.org/tokens/translateContextFunc';
exports['@dialect'] = 'http://schemas.authnomicon.org/tokens/jwt/login-ticket';
