var async    = require('async');
var stashApi = require('stash-api');
var url      = require('url');
var util     = require('util');

/**
 * class Stash
 * Configuration generator for remote Stash repositories.
 *
 * @param {String} url: Stash server URL
 * @param {String} user: Stash username
 * @param {String} pass: Stash password
 */
function Stash(urlString, user, pass) {

  urlObject = url.parse(urlString);
  this.client = new stashApi.StashApi(urlObject.protocol, urlObject.host, urlObject.port, user, pass);
}

/**
 * Generate Repoman configuration from remote Stash repositories.
 *
 * @param {Function} cb: standard cb(err, result) callback
 */
Stash.prototype.generate = function (cb) {
  var self = this;

  var config = {};
  this.client.getProjects().forEach(function project) {
    console.log("=============> PROJECT");
    console.dir(project);
    this.client.getRepos(project.key).forEach(function repo) {
      console.log("=============> REPO");
      console.dir(repo);
      if (repo.scm === 'git') {
        url = util.format('ssh://git@bitbucket.org/%s/%s.git', repo.owner, repo.slug);
        config[repo.slug] = { url: url };
      } else {
        console.error('TODO: %s scm is not yet supported', repo.scm);
      }
    });
  });
  cb(null, config);
};

module.exports = Stash;
