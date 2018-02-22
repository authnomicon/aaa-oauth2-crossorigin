exports = module.exports = function(initialize, cors, parseCookies, parse, csrfProtection, authenticate, errorLogging, errorHandler, Tokens) {
  var oauth2orize = require('oauth2orize')
    , uuid = require('uuid/v4')
    , uid = require('uid-safe');
  
  var NORMALIZED_TRANSFORM_TABLE = {
    'plain': 'none',
    'S256': 'sha256'
  }
  
  
  function validate(req, res, next) {
    console.log('### CO AUTHENTICATE');
    console.log(req.headers);
    console.log(req.body);
    
    if (req.body.co_challenge_method) {
      req.locals.transform = NORMALIZED_TRANSFORM_TABLE[req.body.co_challenge_method];
      if (!req.locals.transform) {
        return next(new oauth2orize.TokenError('Unsupported challenge method: ' + req.body.co_challenge_method, 'invalid_request'))
      }
    }
    
    next();
  }
  
  function respond(req, res, next) {
    // WIP: do this with and without cookies (aka credentials)
    //      rename www/session to www/challenge/pkco
    
    var id = uuid();
    var verifier = uid.sync(16);
    
    var ctx = {};
    ctx.user = req.user;
    ctx.client = { id: '1' };
    ctx.audience = [ {
      id: 'http://localhost/co/authorize',
      secret: 'some-secret-shared-with-oauth-authorization-server'
    } ];
    
    // TODO: Replace this with authInfo session ID
    ctx.sessionID = req.session.id;
    ctx.csrfToken = req.csrfToken();
    ctx.confirmation = [ {
      method: 'cotc',
      id: id,
      verifier: verifier
    } ];
    
    Tokens.cipher(ctx, { type: 'application/jwt', dialect: 'http://schemas.authnomicon.org/tokens/jwt/login-ticket' }, function(err, token) {
      if (err) { return next(err); }
      res.json({ login_ticket: token, co_id: id, co_verifier: verifier });
    });
  }
  
  
  return [
    initialize(),
    cors({ credentials: true, origin: 'http://localhost:3001' }),
    parseCookies(),
    parse('application/json'),
    csrfProtection({ ignoreMethods: [ 'POST' ] }),
    authenticate('local'),
    validate,
    respond,
    errorLogging(),
    errorHandler()
  ];
};

exports['@require'] = [
  'http://i.bixbyjs.org/http/middleware/initialize',
  'http://i.bixbyjs.org/http/middleware/cors',
  'http://i.bixbyjs.org/http/middleware/parseCookies',
  'http://i.bixbyjs.org/http/middleware/parse',
  'http://i.bixbyjs.org/http/middleware/csrfProtection',
  'http://i.bixbyjs.org/http/middleware/authenticate',
  'http://i.bixbyjs.org/http/middleware/errorLogging',
  'http://schemas.authnomicon.org/js/oauth2/http/middleware/errorHandler',
  'http://i.bixbyjs.org/tokens'
];
