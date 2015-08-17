# Flex sensor driver for Intel Edison board
Zetta driver for flex sensor on an intel edision board

##Install

`npm install zetta-flex-edison-driver`

##Usage

To use simply call the `use()` function in your code to use this device.
Note : The sensor reading is dependent on the resistor associted to the circuit. It
is strongly recommended to caliberate the sensor output with the bending angles.

In case no configuration is provided,The driver uses the default settings as provided below.

```javascript
var zetta = require('zetta');
var Flex = require('zetta-flex-edison-driver');

var config = {
	pin: 0, // Analog IO PIN
	minSensorReading: 100, //Minimum sensor reading
	maxSensorReading: 200, //Maximum sensor reading
	minBendAngle: 0,		//Angle in degree when sensor reading is minimum
	maxBendAngle: 90,		//Angle in degree when sensor reading is maximum
};
zetta()
	.use(Flex, config)
	.listen(1337, function(){
		console.log("Zetta is running at http://localhost:1337 ")
	});
```

### Hardware

* [Intel Edison](http://www.intel.com/content/www/us/en/do-it-yourself/edison.html)

