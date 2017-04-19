exports = module.exports = function(begin) {
  
  return {
    begin: begin,
    resume: null
  };
};

exports['@implements'] = 'http://i.bixbyjs.org/http/workflow/Activity';
exports['@name'] = 'cors/challenge/pkco';
exports['@require'] = [
  './pkco/begin'
];
