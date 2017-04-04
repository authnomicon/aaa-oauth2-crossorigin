exports = module.exports = function(Tokens, cors, parseCookies, parse, csrfProtection, authenticate, errorLogging) {
  
  function respond(req, res, next) {
    // TODO:
    
    console.log('################################');
    console.log(req.user);
    console.log(req.headers);
    console.log(req.query);
    
    console.log(req.body);
    
    console.log(req.cookies)
    console.log(req.session);
    
    console.log('CSRF TOKEN IS:');
    console.log(req.csrfToken())
  
    // TODO: Check if we have a cookie header with a previous XSRF.  If so, don't need
    //       cotb
    
    var ctx = {};
    ctx.user = req.user;
    ctx.client = { id: '1' };
    ctx.audience = [ {
      id: 'http://localhost/co/authorize',
      secret: 'some-secret-shared-with-oauth-authorization-server'
    } ];
    
    
    if (req.session.csrfSecret) {
      // TODO: Expand detection of existing csrf ability
      ctx.csrfToken = req.csrfToken();
    } else {
      ctx.confirmation = {
        method: 'cotb',
        origin: req.headers.origin,
        challenge: req.body.cotb_challenge,
        transform: 'none'
      }
    }
    
    
    Tokens.cipher(ctx, { type: 'application/jwt', dialect: 'urn:ietf:params:oauth:token-type:id_token' }, function(err, token) {
      if (err) { return next(err); }
      
      console.log(token);
      
      res.json({ id_token: token });
    });
  }
  
  
  return [
    cors({ credentials: true, origin: 'http://localhost:3001' }),
    parseCookies(),
    parse('application/json'),
    csrfProtection({ ignoreMethods: [ 'POST' ] }),
    function(req, res, next) {
      console.log('******');
      console.log(req.session);
      next();
    },
    authenticate('local'),
    respond,
    errorLogging()
  ];
};

exports['@require'] = [
  'http://i.bixbyjs.org/tokens',
  'http://i.bixbyjs.org/http/middleware/cors',
  'http://i.bixbyjs.org/http/middleware/parseCookies',
  'http://i.bixbyjs.org/http/middleware/parse',
  'http://i.bixbyjs.org/http/middleware/csrfProtection',
  'http://i.bixbyjs.org/http/middleware/authenticate',
  'http://i.bixbyjs.org/http/middleware/errorLogging'
];
