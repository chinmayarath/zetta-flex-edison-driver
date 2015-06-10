var zetta = require('zetta');
var Flex = require('../index');

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