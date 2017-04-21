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
    
    if (ctx.sessionID) {
      // http://openid.net/specs/openid-connect-frontchannel-1_0.html#OPLogout
      claims.sid = ctx.sessionID;
    }
    if (ctx.csrfToken) {
      // https://tools.ietf.org/html/draft-bradley-oauth-jwt-encoded-state-07
      claims.rfp = ctx.csrfToken;
    }
    
    if (ctx.confirmation) {
      conf = ctx.confirmation[0];
      switch (conf.method) {
      case 'cotc':
        // TODO: nonce?
        claims.cnf = {};
        claims.cnf.coo = conf.origin;
        claims.cnf.cov = conf.verifier;
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
