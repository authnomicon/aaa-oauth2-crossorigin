exports = module.exports = function() {
  
  return function interpret(tkn, options, cb) {
    var claims = tkn.claims;
    if (!claims.sub || !claims.cid) {
      // The claims within this token cannot be interpreted in accordance with the
      // MFA OOB code dialect.
      return cb();
    }
    // TODO: check content type
    
    
    var ctx = {};
    ctx.subject = { id: claims.sub };
    ctx.client = { id: claims.cid };
    ctx.csrfToken = claims.rfp;
    
    return cb(null, ctx);
  };
};

exports['@implements'] = 'http://i.bixbyjs.org/tokens/interpretClaimsFunc';
exports['@dialect'] = 'http://schemas.authnomicon.org/aaa/tokens/jwt/si-token';
