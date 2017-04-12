// TODO: Maybe rename "associate".
// Is there an XHR way that accomplishes same as iframes?
// no because CORS headers are easily faked?
// or yes because this iframe is needed when the password is posted back to the host domain
// XHR is needed to pass password to AS

exports = module.exports = function(initialize, csrfProtection, Tokens) {
  var path = require('path')
    , ejs = require('ejs');
  
  
  function validateToken(req, res, next) {
    // TODO: Validate request
    //if (!req.query.id_token_hint) { return next(new SkipSessionInitiationError()); }
    
    
    
    Tokens.decipher(req.query.token, { dialect: 'urn:ietf:params:oauth:token-type:id_token' }, function(err, claims, issuer) {
      if (err) { return next(err); }
      
      req.locals.challenge = claims.confirmation[0].challenge;
      next();
    });
  }
  
  function respond(req, res, next) {
    res.locals.csrfToken = req.csrfToken();
    res.locals.token = req.query.token;
    
    var filename = path.join(__dirname, '../../../../www/session/challenge.html.ejs');
    ejs.renderFile(filename, res.locals, function(err, html) {
      if (err) { return next(err); }
      return res.send(html);
    });
  }
  
  
  return [
    initialize(),
    csrfProtection(),
    validateToken,
    respond
  ];
};

exports['@require'] = [
  'http://i.bixbyjs.org/http/middleware/initialize',
  'http://i.bixbyjs.org/http/middleware/csrfProtection',
  'http://i.bixbyjs.org/tokens'
];
