exports = module.exports = function(Tokens, cors, parseCookies, parse, csrfProtection, errorLogging) {
  
  function respond(req, res, next) {
    // TODO:
    
    console.log(req.headers);
    console.log(req.query);
    
    console.log(req.body);
    
    console.log(req.cookies)
    console.log(req.session);
    
    console.log('CSRF TOKEN IS:');
    console.log(req.csrfToken())
  
    
    var ctx = {};
    ctx.user = { id: '1234' };
    ctx.client = { id: '1' };
    ctx.audience = [ {
      id: 'http://localhost/co/authorize',
      secret: 'some-secret-shared-with-oauth-authorization-server'
    } ];
    ctx.csrfToken = req.csrfToken();
    
    Tokens.cipher(ctx, { dialect: 'http://schemas.authnomicon.org/aaa/tokens/jwt/si-token' }, function(err, token) {
      if (err) { return cb(err); }
      
      console.log(token);
      
      res.json({ session_token: token });
    });
  }
  
  
  return [
    cors({ credentials: true, origin: 'http://localhost:3001' }),
    parseCookies(),
    parse('application/x-www-form-urlencoded'),
    csrfProtection({ ignoreMethods: ['POST'] }),
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
  'http://i.bixbyjs.org/http/middleware/errorLogging'
];
