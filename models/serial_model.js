var mongoose = require('mongoose');

module.exports = serial_model = function()
{
	SerialSchema = mongoose.Schema(
	{
		serialNumber : String,
		device_id    : mongoose.Schema.ObjectId
	});

	Serial = mongoose.model('serial', SerialSchema);
}