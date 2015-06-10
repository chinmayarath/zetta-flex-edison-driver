var Device = require('zetta-device');
var util = require('util');
var mraa = require('mraa-js');

/**
 *
 * If no configuration is not provided use the default settings as
 *
 * <ul>
 * 		<li> pin : 0 </li>
 * 		<li> minSensorReading : 0 (This will be set after sensor read) </li>
 * 		<li> maxSensorReading : 0 (This will be set after sensor read)</li>
 * 		<li> minBendAngle : 0 Deg </li>
 * 		<li> maxBendAngle : 90 Deg</li>
 * </ul>
 * @type {Object}
 */
var DefaultSettings = {
  pin: 0,
  minSensorReading: 100,
  maxSensorReading: 200,
  minBendAngle: 0,
  maxBendAngle: 90,
};

/**
 * Number of reads before device is auto caliberated
 * @type {Number}
 */
var __CALIBERATION_THRESHOLD = 3;

/**
 * Caliberation range
 * @type {Number}
 */
var __CALIBERATION_RANGE = 50;

/**
 * Default read interval for the flex sensor
 * @type {Number}
 */
var __DEFAULT_READ_INTERVAL = 100;

var FlexSensor = module.exports = function(config) {
  Device.call(this);
  if (!config) {
    this.config = DefaultSettings;
    this._caliberated = false;
    this._caliberation_tries = 0;
    this._meanSensorValue = 0;
    this._readValue = [];
  } else {
    this.config = config;
    this._caliberated = true;
  }
  this._pin = new mraa.Aio(this.config.pin);
};


util.inherits(FlexSensor, Device);

FlexSensor.prototype.init = function(config) {
  config
    .type('flex')
    .name('flex ' + this.config.pin)
    .monitor('angle');

  var self = this;
  var interval = self.config.interval || __DEFAULT_READ_INTERVAL;
  setInterval(function() {
    var rawValue = self._pin.read();
    if (!self._caliberated) {
      if (self._caliberation_tries < __CALIBERATION_THRESHOLD) {
        self._readValue.push(rawValue);
        self._meanSensorValue = self._readValue.reduce(function(prev, cur) {
          return prev + cur;
        }) / self._readValue.length;
        self._caliberation_tries++;
        self.config.minSensorReading = self._meanSensorValue - __CALIBERATION_RANGE;
        self.config.maxSensorReading = self._meanSensorValue + __CALIBERATION_RANGE;
      } else {
        self._caliberated = true;
      }

    }
    var mappedValue = map(rawValue, config.minSensorReading, config.maxSensorReading, config.minBendAngle, config.maxBendAngle);
    self.angle = mappedValue;
  }, interval);


};

function map(x, in_min, in_max, out_min, out_max) {
  return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}