exports = module.exports = function(store, Tokens) {
  var qs = require('querystring');

  
  function challenge(req, res, next) {
    var params = req.locals || {}
      , state = {
        name: 'oauth2/crossorigin/initiate-session',
        ticket: params.ticket
      };
    if (params.state) { state.parent = params.state; }
    
    
    Tokens.decipher(params.ticket, { dialect: 'http://schemas.authnomicon.org/tokens/jwt/login-ticket' }, function(err, claims) {
      if (err) { return next(err); }
      
      var confirmation = claims.confirmation || []
        , conf;
      
      if (confirmation.length == 0) {
        // TODO: error, unable to confirm
      }
      
      // TODO: Sort the confirmation claims by preferred order...

      for (i = 0, len = confirmation.length; i < len; ++i) {
        conf = confirmation[i];
        
        switch (conf.method) {
        case 'cotc':
          store.save(req, state, function(err, h) {
            if (err) { return next(err); }
            return res.redirect('/co/confirm/cotc' + '?' + qs.stringify({ id: conf.id, state: h }));
          });
          break;
          
        default:
          // TODO: HTTP errors
          return next(new Error('Unsupported confirmation method: ' + conf.name));
        }
      }
    });
  }


  return [
    challenge
  ];
};

exports['@require'] = [
  'http://i.bixbyjs.org/http/state/Store',
  'http://i.bixbyjs.org/tokens'
];
