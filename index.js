var Scout = require('zetta-scout');
var util = require('util');
var FLEX = require('./flex');


var FlexScout = module.exports = function(config) {
  this.config = config;
  Scout.call(this);
}

util.inherits(FlexScout, Scout);

FlexScout.prototype.init = function(next) {
  var self = this;
  var query = self.server.where({
    type: 'flex',
    config : self.config.pin + ""
  });
  self.server.find(query, function(err, results) {
    if (results[0]) {
      self.provision(results[0], FLEX, self.config);
    } else {
      self.discover(FLEX, self.config);
    }
  });
  next();
};