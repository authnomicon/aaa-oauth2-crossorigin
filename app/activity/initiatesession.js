exports = module.exports = function(begin, resume) {
  
  return {
    begin: begin,
    resume: resume
  };
};

exports['@implements'] = 'http://i.bixbyjs.org/http/workflow/Activity';
exports['@name'] = 'oauth2/crossorigin/initiate-session';
exports['@require'] = [
  './initiatesession/begin',
  './initiatesession/resume'
];
