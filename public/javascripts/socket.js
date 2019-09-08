var socket = io();

socket.on('new-sensor-data', function(data)
{
	if(device.identification == data.location_id)
	{
		data.date = Date.parse(data.date);
		chart.flow(
		{
			json:
			{
				date  : data.date,
				co    : data.co,
				c6h6  : data.c6h6,
				no2   : data.no2
			},
			length: 0,
			duration: 700
		});

		table.row.add(
		{
			'date': data.date,
			'time': data.date,
			'co': data.co,
			'c6h6': data.c6h6,
			'no2': data.no2,
			'temperature': data.temperature,
			'humidity': data.humidity,
			'pressure': data.pressure,
			'_id': data._id
		}).draw();

		$('#temperature').text(data.temperature + ' °');
		$('#humidity').text(data.humidity + ' %');
		$('#pressure').text(data.pressure);
		$('#envi-fact-date').text(getDateTime(data.date));
	}
});

socket.on('new-index-data', function(data)
{
	console.log(data);
	data.date = new Date(data.date);

	AQI_Generate(data.aqi_co, data.aqi_no2);

	aqi_gauge_co.load(
	{
		json:
		{
			co: data.aqi_co
		}
	});

	aqi_gauge_no2.load(
	{
		json:
		{
			no2: data.aqi_no2
		}
	});

	var load_date      = [],
		load_index_co  = [],
		load_index_no2 = [];

	$.each(data.aqi_prev, function(i, obj)
	{
		load_date.push(getDateTime(obj.date));
		load_index_co.push(obj.index_co);
		load_index_no2.push(obj.index_no2);
	});

	load_date.push(getDateTime(data.date));
	load_index_co.push(data.aqi_co);
	load_index_no2.push(data.aqi_no2);

	console.log(load_date);
	console.log(load_index_co);

	aqi_bar_co.load(
	{
		json: 
		{
			date      : load_date,
			index_co  : load_index_co
		}
	});

	aqi_bar_no2.load(
	{
		json:
		{
			date      : load_date,
			index_no2 : load_index_no2
		}
	});
})