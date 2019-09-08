var mongoose = require('mongoose');

module.exports = user_model = function()
{
	UserSchema = new mongoose.Schema(
	{
		username: String,
		password: String
	});

	Admin = mongoose.model('admin', UserSchema);
}