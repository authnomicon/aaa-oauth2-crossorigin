exports = module.exports = {
  'tokens/jwt/si/interpret': require('./tokens/jwt/si/interpret'),
  'tokens/jwt/si/translate': require('./tokens/jwt/si/translate')
};

exports.load = function(id) {
  try {
    return require('./' + id);
  } catch (ex) {
    if (ex.code == 'MODULE_NOT_FOUND') { return; }
    throw ex;
  }
};
