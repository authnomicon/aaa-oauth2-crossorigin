exports = module.exports = function(store) {
  var qs = require('querystring');


  // TODO: If no state, and there's a returnTo option, store that
  //       as initial state.

  function redirect(req, res, next) {
    var options = req.locals || {}
      , state;
    
    console.log('REDIRECT TO PKCO!');
    console.log(options);
    console.log(req.state);
    
    state = {
      name: 'co/challenge/pkco',
      token: options.token
    };
    if (options.state) { state.parent = options.state; }
    
    store.save(req, state, function(err, h) {
      q = qs.stringify({ state: h });
      return res.redirect('/co/challenge/pkco' + '?' + q);
    });
  }


  return [
    redirect
  ];
  
};

exports['@require'] = [
  'http://i.bixbyjs.org/http/state/Store'
];
