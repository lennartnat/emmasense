var express = require('express');
var router  = express.Router();

var ser     = require('../methods/serial');

router.get('/', function(req, res, next)
{
	res.render('admin', 
	{
		title: 'EMMA | Administrator',
	});
});

router.get('/deploy', function(req, res, next)
{
	Device.find().then(function(data)
	{
		res.render('map_add',
		{
			title: 'EMMA | Deploy',
			devices: data
		});
	});
});

router.post('/addDevice', function(req, res, next)
{
	var identification = req.body.identification,
		address        = req.body.address,
		latitude       = req.body.latitude,
		longitude      = req.body.longitude;

	var device = new Device(
	{
		identification : identification,
		address        : address,
		latitude       : latitude,
		longitude      : longitude,
		aqi            : null
	});

	device.save();	

	var serial = new Serial(
	{
		serialNumber : ser.generateSerialNumber(4,5),
		device_id    : device._id
	});

	serial.save();

	res.redirect('deploy');
});

router.post('/getSerial', function(req, res, next)
{
	Serial.findOne({ device_id: req.body.device_id }, 'serialNumber', function(err, data)
	{
		res.send(data);
	})
})

module.exports = router;