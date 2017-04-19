// TODO: Maybe rename "associate".
// Is there an XHR way that accomplishes same as iframes?
// no because CORS headers are easily faked?
// or yes because this iframe is needed when the password is posted back to the host domain
// XHR is needed to pass password to AS

exports = module.exports = function(initialize, parse, csrfProtection, loadState, Tokens) {
  var path = require('path');
  
  
  function decipherToken(req, res, next) {
    console.log('DECIPHERING TOKNE');
    console.log(req.body)
    console.log(req.state);
    
    
    Tokens.decipher(req.state.token, { dialect: 'http://schemas.authnomicon.org/tokens/jwt/login-ticket' }, function(err, claims, issuer) {
      if (err) { return next(err); }
      
      console.log('GOT CLAIMS');
      console.log(claims);
      
      req.locals.claims = claims;
      next();
    });
  }
  
  function confirmToken(req, res, next) {
    var confirmation = req.locals.claims.confirmation || []
      , conf;

    for (i = 0, len = confirmation.length; i < len; ++i) {
      conf = confirmation[i];
      
      console.log('CHECK THIS:');
      console.log(conf)
      console.log(req.body);
      
      
      switch (conf.method) {
      case 'pkco':
        if (conf.challenge !== req.body.verifier) { // TODO: SHA256
          // TODO: HTTP ERRORS
          return next(new Error('Not confirmed'));
        }
        break;
        
      default:
        // TODO: HTTP errors
        return next(new Error('Unsupported confirmation method: ' + conf.name));
      }
    }
    
    next();
  }
  
  function respond(req, res) {
    console.log('SETTING UP SESSION...');
    console.log(req.body)
    
    res.send('TODO')
  }
  
  
  return [
    initialize(),
    parse('application/x-www-form-urlencoded'),
    csrfProtection(),
    loadState('co/challenge/pkco', { required: true }),
    decipherToken,
    confirmToken,
    respond
  ];
};

exports['@require'] = [
  'http://i.bixbyjs.org/http/middleware/initialize',
  'http://i.bixbyjs.org/http/middleware/parse',
  'http://i.bixbyjs.org/http/middleware/csrfProtection',
  'http://i.bixbyjs.org/http/middleware/loadState',
  'http://i.bixbyjs.org/tokens'
];
