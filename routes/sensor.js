var express  = require('express')
var fs       = require('fs');

var aqi      = require('../methods/aqi');
var csv      = require('../methods/csv');
var times	 = require('../methods/times');

var router = express.Router();

router.get('/:locationId', function(req, res, next)
{
	var locationId = req.params.locationId;

	Sensor.find({location_id: locationId}).then(function(data)
	{
		Aqi.find({location_id: locationId}).then(function(data2)
		{
			Device.findOne({identification: locationId}).then(function(data3)
			{
				res.render('dashboard',
				{
					title		: 'EMMA | Dashboard',
					sensor_data	: data,
					index_data  : data2,
					device      : data3
				});
			})
			
		});
	});
});

router.post('/create-data', function(req, res, next)
{
	/*------- Validate data ---------*/
	if(req.body.location_id && req.body.serialNumber)
	{
		Serial.findOne({ serialNumber: req.body.serialNumber }, function(err, data)
		{
			if(err) throw err;

			if(!data)
			{
				res.json(
				{
					response:
					{
						status: 'NOK',
						message: 'ERROR: Invalid serial number.'
					}
				});
			}
			else if(data)
			{
				Device.findOne({ _id: data.device_id }, function(err, data2)
				{
					if(err) throw err;

					if(!data2)
					{
						res.json(
						{
							response:
							{
								status: 'NOK',
								message: 'ERROR: No device found.'
							}
						});
					}
					else
					{
						if(data2.identification == req.body.location_id)
						{
							var io = req.io.sockets;

							var sensed = new Sensor(
							{
								date        : new Date(),
								location_id : req.body.location_id,
								co          : req.body.co,
								c6h6        : req.body.c6h6,
								no2         : req.body.no2,
								temperature : req.body.temperature,
								humidity    : req.body.humidity,
								pressure    : req.body.pressure
							});
							sensed.save();

							io.emit('new-sensor-data', sensed);
							aqi.update(
							{
								location_id : sensed.location_id,
								date        : sensed.date
							}, io);

							res.json(
							{
								response:
								{
									status  : 'OK',
									message : 'Data saved.',
									time    : sensed.date
								}
							});
						}
						else
						{
							res.json(
							{
								response:
								{
									status: 'NOK',
									message: 'ERROR: Incorrect serial number.'
								}
							});
						}
					}
				});
			}
		});
	}
	else
	{
		res.json(
		{
			response:
			{
				status  : 'NOK',
				message : 'ERROR: Bad request.'
			}
		})
	}
});

router.post('/export-data/:locationId', function(req, res, next)
{
	date = req.body.exportdate;
	date_from = new Date(date.substr(0, 14));
	date_to = new Date(date.substr(16));

	// Reduce 8 hours from download
	var GMT_8 = (8 * 60 * 60 * 1000);
	from_date = new Date(Number(date_from) - GMT_8);
	to_date   = new Date(Number(date_to) - GMT_8);

	Sensor.find({ location_id: req.params.locationId, date: {$gt: from_date, $lt: to_date }}).then(function(data)
	{
		// Add +8 hours to data's dates
		for(i in data)
		{
			data[i].date = new Date(Number(data[i].date) + GMT_8);
		}

		var csv_fields = ['date', 'time', 'co', 'c6h6', 'no2', 'temperature', 'humidity', 'pressure'];
		var data_csv = csv.toCSV({headers: csv_fields, data: data});

		var timestamp = times.generateTimestamp();
		fs.writeFile('dl/data_' + timestamp + '.csv', data_csv, function(err)
		{
			if(err) throw err;
			else
				res.download(__dirname + '/../dl/data_' + timestamp + '.csv', 'Emission Data.csv');
				fs.appendFile('dl/dl.txt', timestamp + '\r\n', function(er)
				{
					if(er) throw er;
					else
						fs.unlink('dl/data_' + timestamp + '.csv', function(e)
						{
							if(e) throw e;
						});
				});
		});
	});
	
});

router.get('/delete-data/:id', function(req, res, next)
{
	console.log(req.params.id);
	Sensor.findByIdAndRemove(req.params.id, function(err, doc)
	{
		if(err)
		{
			throw err;
		}
	});
	res.redirect('/');
});

module.exports = router;