var mongoose = require('mongoose');

module.exports = location_model = function()
{
	DeviceSchema = new mongoose.Schema(
	{
		identification : String,
		address        : String,
		latitude       : Number,
		longitude      : Number,
		aqi            :
		{
			type : mongoose.Schema.ObjectId,
			ref  : 'Aqi'
		}
	});

	Device = mongoose.model('device', DeviceSchema);
}