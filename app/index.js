exports = module.exports = {
  'tokens/login-ticket/interpret': require('./tokens/login-ticket/interpret'),
  'tokens/login-ticket/translate': require('./tokens/login-ticket/translate')
};

exports.load = function(id) {
  try {
    return require('./' + id);
  } catch (ex) {
    if (ex.code == 'MODULE_NOT_FOUND') { return; }
    throw ex;
  }
};
