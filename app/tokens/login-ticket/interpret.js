exports = module.exports = function() {
  
  return function interpret(tkn, options, cb) {
    var claims = tkn.claims;
    
    var ctx = {};
    ctx.subject = { id: claims.sub };
    ctx.client = { id: claims.azp };
    ctx.sessionID = claims.sid;
    ctx.csrfToken = claims.rfp;
    
    if (claims.cnf) {
      ctx.confirmation = [];
      
      keys = Object.keys(claims.cnf);
      for (i = 0, len = keys.length; i < len; ++i) {
        key = keys[i];
       
        switch (key) {
        case 'cov':
          //TODO: nonce?
          ctx.confirmation.push({
            method: 'cotc',
            origin: claims.cnf.coo,
            verifier: claims.cnf.cov
          });
          break;
        case 'coo':
          break;
        default:
          ctx.confirmation.push({ method: 'unknown', name: key });
          break;
        }
      }
    }
    
    return cb(null, ctx);
  };
};

exports['@implements'] = 'http://i.bixbyjs.org/tokens/interpretClaimsFunc';
exports['@dialect'] = 'http://schemas.authnomicon.org/tokens/jwt/login-ticket';
