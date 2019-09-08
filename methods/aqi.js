var hour_mills = 3600000,
	hour_secs  = hour_mills/1000,
	hour_mins  = hour_secs/60,
	hour_hr    = hour_mins/60;

var class_bounds =
{
	'index': 	[{'low': 0, 'high': 50},
				{'low': 51, 'high': 100},
				{'low': 101, 'high': 150},
				{'low': 151, 'high': 200},
				{'low': 201, 'high': 300},
				{'low': 300, 'high': 500}],
	
	'conc_co': 	[{'low': 0, 'high': 5},
				{'low': 5.1, 'high': 10.7},
				{'low': 10.8, 'high': 14.2},
				{'low': 14.3, 'high': 17.6},
				{'low': 17.7, 'high': 34.8},
				{'low': 34.9, 'high': 57.7}],

	'conc_no2': [{'low': 0, 'high': 0.09},
				{'low': 0.1, 'high': 0.18},
				{'low': 0.19, 'high': 0.67},
				{'low': 0.68, 'high': 1.22},
				{'low': 1.23, 'high': 2.35},
				{'low': 2.36, 'high': 3.86}]
};

function getCB(conc, pol, cb_type)
{
	var cb_conc = (pol == 'co')? class_bounds.conc_co : class_bounds.conc_no2;

	for(i in cb_conc)
	{
		if(conc >= cb_conc[i].low && conc <= cb_conc[i].high)
		{
			if(cb_type == 0) 	// Index
				return class_bounds.index[i];
			else				// Concentration
				return cb_conc[i];
		}
	}
}

function calculateIndex(pollutionData)
{
	var index_cb = getCB(pollutionData.mean, pollutionData.pollutant, 0);
	var conc_cb  = getCB(pollutionData.mean, pollutionData.pollutant, 1);

	var index = Math.round((((index_cb.high - index_cb.low) / (conc_cb.high - conc_cb.low)) * (pollutionData.mean - conc_cb.low)) + index_cb.low);

	return index;
}

function pursuitIndex(socket_data, io)
{
	// Query sensor data for the past hour of device at current location 
	Sensor.find({ location_id: socket_data.location_id, date: { $gt: (socket_data.date - hour_mills) }}).then(function(query_sensor)
	{
		d1 = query_sensor[0].date;
		d2 = query_sensor[query_sensor.length - 1].date;

		// Calculate milliseconds elapsed between the first and last data queried
		mills_elapsed = d2 - d1;
		mins_elapsed  = (mills_elapsed / 1000) / 60;

		// If minutes elapsed is more than or equal to 50 minutes
		if(mins_elapsed >= 50)
		{
			console.log('There is a 1-hour gap between first and last data!');

			var sum_co  = 0.0,
				sum_no2 = 0.0,
				avg_co  = 0.0,
				avg_no2 = 0.0,
				aqi_co  = 0.0,
				aqi_no2 = 0.0;

			// Traverse through sensor data and get sum of CO and NO2
			for(i in query_sensor)
			{
				sum_co  += query_sensor[i].co;
				sum_no2 += query_sensor[i].no2;
			}

			// Calculate average for gases [toFixed -> decimal places]
			avg_co  = parseFloat((sum_co / query_sensor.length).toFixed(1));
			avg_no2 = parseFloat((sum_no2 / query_sensor.length).toFixed(2));

			// Calculate AQI for CO and NO2
			aqi_co  = calculateIndex({ mean: avg_co, pollutant: 'co' });
			aqi_no2 = calculateIndex({ mean: avg_no2, pollutant: 'no2' });

			var aqi_data = new Aqi(
			{
				date        : d2,
				location_id : socket_data.location_id,
				index_co    : aqi_co,
				index_no2   : aqi_no2,
				mean_co     : avg_co,
				mean_no2    : avg_no2
			});

			// Insert new AQI data to database
			aqi_data.save();

			// Update 'aqi' of device at current location in database
			Device.findOneAndUpdate({ identification: socket_data.location_id }, { $set: { aqi: aqi_data._id }}, { new: true }, function(err, query_update)
			{
				if(err) console.log(err);
				else    console.log(query_update);
			});

			// Query previous AQI data of device at current location
			Aqi.find({ location_id: socket_data.location_id }).then(function(query_aqi_prev)
			{
				// Emit socket for updating charts
				io.emit('new-index-data',
				{ 
					date     : d2,
					aqi_co   : aqi_co,
					aqi_no2  : aqi_no2,
					aqi_prev : query_aqi_prev
				});
			});
		}
		else
		{
			console.log('No 1-hour gap yet between first and last data. Mins left: ' + (60 - mins_elapsed));
		}
	});
}

module.exports =
{
	update: function(socket_data, io)
	{
		// Query Location and get only the 'aqi' column
		Device.findOne({ identification: socket_data.location_id }, 'aqi', function(err, query_device)
		{
			if(!query_device.aqi)
			{
				pursuitIndex(socket_data, io);
			}
			else
			{
				// Populate query with the 'aqi' object
				Device.populate(query_device, {path: 'aqi'}, function(err, query_aqi)
				{
					// Calculate milliseconds elapsed since last AQI until new
					mills_elapsed = Number(socket_data.date - query_aqi.aqi.date);
					mins_elapsed  = (mills_elapsed / 1000) / 60;

					// If minutes elapsed is more than or equal to an hour
					if(mins_elapsed >= 60)
					{
						
						pursuitIndex(socket_data, io);
					}
					else
					{
						console.log('It has not yet been an hour since the last AQI. Mins left: ' + (60 - (mills_elapsed/1000/60)))
					}
				});
			}
		});
	}
};