exports = module.exports = function() {
  
  return function interpret(tkn, options, cb) {
    var claims = tkn.claims;
    
    var ctx = {};
    ctx.subject = { id: claims.sub };
    ctx.client = { id: claims.azp };
    ctx.csrfToken = claims.rfp;
    
    if (claims.cnf) {
      ctx.confirmation = [];
      
      keys = Object.keys(claims.cnf);
      for (i = 0, len = keys.length; i < len; ++i) {
        key = keys[i];
       
        switch (key) {
        case 'co_challenge':
          //TODO: nonce?
          ctx.confirmation.push({
            method: 'pkco',
            origin: claims.cnf.co_origin,
            challenge: claims.cnf.co_challenge,
            transform: claims.cnf.co_challenge_method || 'plain'
          });
          break;
        case 'co_origin':
        case 'co_challenge_method':
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
