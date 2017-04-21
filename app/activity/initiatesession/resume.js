exports = module.exports = function(initialize, completeActivity, failActivity, Tokens, directory) {
  
  
  function confirmTicket(req, res, next) {
    Tokens.decipher(req.state.ticket, { dialect: 'http://schemas.authnomicon.org/tokens/jwt/login-ticket' }, function(err, claims, issuer) {
      if (err) { return next(err); }
      
      var confirmation = claims.confirmation || []
        , conf;

      // TODO: Select confirmation method based on state

      for (i = 0, len = confirmation.length; i < len; ++i) {
        conf = confirmation[i];
        
        if (conf.method !== 'cotc') { continue; }
        
      
        switch (conf.method) {
        case 'cotc':
          if (conf.verifier !== res.locals.verifier) { // TODO: SHA256
            // TODO: HTTP ERRORS
            return next(new Error('Not confirmed'));
          }
          //delete res.locals.verifier;
          break;
        
        default:
          // TODO: HTTP errors
          return next(new Error('Unsupported confirmation method: ' + conf.name));
        }
      }
      
      req.locals.subject = claims.subject;
      next();
    });
  }

  function initiateSession(req, res, next) {
    var subject = req.locals.subject;
    
    directory.find(subject.id, function(err, user) {
      if (err) { return next(err); }
      // TODO: If no user, error.
      
      req.login(user, function(err) {
        if (err) { return next(err); }
        return next();
      });
    });
  }
  
  // TODO: add some post-inititae middleware here that is shared (ie, to do MFA, etc...)
  
  function respond(req, res) {
    // TODO: Default behavior for when this didn't have a parent state (shouldn't happen...)
    
    console.log('LOGGED IN!');
    console.log(req.user);
    
    res.send('TODO')
  }


  return [
    initialize(),
    confirmTicket,
    initiateSession,
    completeActivity('oauth2/crossorigin/initiate-session'),
    failActivity('oauth2/crossorigin/initiate-session'),
    respond
  ];
};

exports['@require'] = [
  'http://i.bixbyjs.org/http/middleware/initialize',
  'http://i.bixbyjs.org/http/middleware/completeTask',
  'http://i.bixbyjs.org/http/middleware/failTask',
  'http://i.bixbyjs.org/tokens',
  'http://i.bixbyjs.org/ds/Directory'
];
