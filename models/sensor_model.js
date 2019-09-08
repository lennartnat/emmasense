var mongoose = require('mongoose');

module.exports = sensor_model = function()
{
	SensorSchema = new mongoose.Schema(
	{
		date 			: Date,
		location_id     : String,
		co 				: Number,
		c6h6			: Number,
		no2				: Number,
		temperature 	: Number,
		humidity 		: Number,
		pressure		: Number
	});

	Aqi_MultiGasSchema = new mongoose.Schema(
	{
		date 			: Date,
		location_id     : String,
		index_co		: Number,
		index_no2 		: Number,
		mean_co 		: Number,
		mean_no2		: Number
	});

	Sensor = mongoose.model('Sensor', SensorSchema);
	Aqi    = mongoose.model('Aqi', Aqi_MultiGasSchema);
}