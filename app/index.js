/*
exports = module.exports = {
  'ext/crossorigin': require('./ext/crossorigin'),
  'tokens/login-ticket/interpret': require('./tokens/login-ticket/interpret'),
  'tokens/login-ticket/translate': require('./tokens/login-ticket/translate')
};
*/

exports = module.exports = function(id) {
  try {
    return require('./' + id);
  } catch (ex) {
    if (ex.code == 'MODULE_NOT_FOUND') { return; }
    throw ex;
  }
};
