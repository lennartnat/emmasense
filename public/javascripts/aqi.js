AQI_Init();

function AQI_Init()
{
	var i_size = idata.length - 1;
	var last_aqi_co     = idata[i_size].index_co,
		last_aqi_no2    = idata[i_size].index_no2;

	// aqi_val     = Math.max(last_aqi_co, last_aqi_no2);
	aqi_val     = last_aqi_co;
	// aqi_polname = AQI_GetPollutantName(last_aqi_co, last_aqi_no2);
	aqi_polname = "CO";
	aqi_class   = AQI_GetClass(aqi_val);
	aqi_advise  = AQI_GetAdvisory(aqi_val, aqi_polname);
	aqi_cat     = AQI_GetCategory(aqi_val);

	$('#aqi-idx').text(aqi_val);
	$('#aqi-panel-heading').addClass(aqi_class);
	$('#aqi-progbar').width(String(aqi_val / 3.0) + '%').addClass(aqi_class);
	$('#aqi-date-time').text(getDateTime(idata[i_size].date));
	$('#aqi-pollutant').text(aqi_polname);
	$('#aqi-category').text(aqi_cat).addClass(aqi_class);
	$('#aqi-advisory-heading').addClass(aqi_class);
	$('#aqi-advisory').text(aqi_advise);
}


function AQI_Generate(aqi_co, aqi_no2)
{
	// aqi = Math.max(aqi_co, aqi_no2);
	aqi = aqi_co;
	// aqi_pollutant = AQI_GetPollutantName(aqi_co, aqi_no2);
	aqi_pollutant = "CO";
	aqi_class = AQI_GetClass(aqi);
	aqi_advisory = AQI_GetAdvisory(aqi, aqi_pollutant);

	aqi_prev = $('#aqi-idx').text();
	aqi_prev_class = AQI_GetClass(aqi_prev);

	$('#aqi-panel-heading').removeClass(aqi_prev_class).addClass(aqi_class);
	$('#aqi-category').fadeToggle(function()
	{
		$(this).removeClass(aqi_prev_class).addClass(aqi_class).text(AQI_GetCategory(aqi));
	}).fadeToggle();

	$('#aqi-progbar').width(String(aqi/3.0)+'%');
	$('#aqi-progbar').removeClass(aqi_prev_class).addClass(aqi_class);

	$('#aqi-idx').slideToggle(300, function()
	{
		$(this).text(aqi);
	}).slideToggle();

	$('#aqi-date-time').text(getDateTime(null, 1));
	$('#aqi-pollutant').text(aqi_pollutant);

	$('#aqi-advisory-heading').removeClass(aqi_prev_class).addClass(aqi_class);
	$('#aqi-advisory').fadeToggle(300, function()
	{
		$(this).text(aqi_advisory);
	}).fadeToggle();
};

function AQI_GetPollutantName(aqi_co, aqi_no2)
{
	if(Math.max(aqi_co, aqi_no2) == aqi_co)
	{
		return 'CO';
	}
	else
	{
		return 'NO2';
	}
}

function AQI_GetClass(AQI)
{
	if(AQI < 51)
	{
		return 'aqi-g';
	}
	else if(AQI < 101)
	{
		return 'aqi-y';
	}
	else if(AQI < 151)
	{
		return 'aqi-o';
	}
	else if(AQI < 201)
	{
		return 'aqi-r';
	}
	else if(AQI < 301)
	{
		return 'aqi-p';
	}
	else
	{
		return 'aqi-m';
	}
}

function AQI_GetCategory(AQI)
{
	if(AQI < 51)
	{
		return 'Good';
	}
	else if(AQI < 101)
	{
		return 'Moderate';
	}
	else if(AQI < 151)
	{
		return 'Unhealthy for sensitive groups';
	}
	else if(AQI < 201)
	{
		return 'Unhealthy';
	}
	else if(AQI < 301)
	{
		return 'Very unhealthy';
	}
	else
	{
		return 'Hazardous';
	}
}

function AQI_GetAdvisory(AQI, AQI_Pollutant)
{
	var advisory = '';
	switch(AQI_Pollutant)
	{
		case 'CO':
			if(AQI < 101)
			{
				advisory = 'AQI for CO is in good condition. You can enjoy outdoors.';
			}
			else if(AQI < 151)
			{
				advisory = 'People with heart disease, such as angina, should limit heavy exertion and avoid sources of CO, such as heavy traffic.';
			}
			else if(AQI < 201)
			{
				advisory = 'People with heart disease, such as angina, should limit moderate exertion and avoid sources of CO, such as heavy traffic.';
			}
			else if(AQI < 301)
			{
				advisory = 'People with heart disease, such as angina, should avoid exertion and avoid sources of CO, such as heavy traffic.';
			}
			else
			{
				advisory = 'People with heart disease, such as angina, should avoid exertion and sources of CO, such as heavy traffic; everyone else should limit heavy exertion.';
			}
			break;
		case 'NO2':
			if(AQI < 51)
			{
				advisory = 'AQI for NO2 is in good condition. You can enjoy outdoors.';
			}
			if(AQI < 101)
			{
				advisory = 'Unusually sensitive individuals should consider limiting prolonged exertion especially near busy roads.';
			}
			else if(AQI < 151)
			{
				advisory = 'People with asthma, children and older adults should limit prolonged exertion especially near busy roads.';
			}
			else if(AQI < 201)
			{
				advisory = 'People with asthma, children and older adults should avoid prolonged exertion near roadways; everyone else should limit prolonged exertion especially near busy roads.';
			}
			else if(AQI < 301)
			{
				advisory = 'People with asthma, children and older adults should avoid all outdoor exertion; everyone else should avoid prolonged exertion especially near busy roads.';
			}
			else
			{
				advisory = 'People with asthma, children and older adults should remain indoors; everyone else should avoid all outdoor exertion.';
			}
			break;
	}
	return advisory;
}

var aqi_gauge_co = c3.generate(
{
	bindto: '#aqi-co',
	data:
	{
		json:
		{
			co: idata[idata.length - 1].index_co
		},
		names:
		{
			co: 'Current CO AQI'
		},
		type: 'gauge'
	},
	gauge:
	{
		fullCircle: true,
		startingAngle: 25.135,
		min: 0,
		max: 300,
		label:
		{
			show: false,
			format: function(value, ratio)
			{
				return value;
			}
		}
	},
	color:
	{
		// pattern: ['#21c621', '#fff723', '#ff9523', '#ff1111', '#c814ff', '#962509'],
		pattern: ['#4ce600', '#fff71a', '#ff7e00', '#ff0000', '#8f3f97', '#7e0023'],
		threshold:
		{
			values: [51, 101, 151, 201, 301]
		}
	},
	size:
	{
		height: 177
	}
})

var aqi_gauge_no2 = c3.generate(
{
	bindto: '#aqi-no2',
	data:
	{
		json:
		{
			no2: 13
		},
		names:
		{
			no2: 'Current NO2 AQI'
		},
		type: 'gauge'
	},
	gauge:
	{
		fullCircle: true,
		startingAngle: 25.135,
		min: 0,
		max: 300,
		label:
		{
			show: false,
			format: function(value, ratio)
			{
				return value;
			}
		}
	},
	color:
	{
		pattern: ['#4ce600', '#fff71a', '#ff7e00', '#ff0000', '#8f3f97', '#7e0023'],
		threshold:
		{
			values: [51, 101, 151, 201, 301]
		}
	},
	size:
	{
		height: 177
	}
})

var aqi_prev_date = [],
	aqi_prev_co   = [],
	aqi_prev_no2  = [];

$.each(idata, function(i, obj)
{
	aqi_prev_date.push(getDateTime(Date.parse(obj.date)));
	aqi_prev_co.push(obj.index_co);
	aqi_prev_no2.push(obj.index_no2);
});


console.log(aqi_prev_date);
console.log(aqi_prev_co);
console.log(aqi_prev_no2);

var aqi_bar_co = c3.generate(
{
	bindto: '#aqi-bar-co',

	data:
	{
		json:
		{
			date     : aqi_prev_date,
			index_co : aqi_prev_co
		},
		// {
		// 	CO: [35,57,12,104,75,89,201,187,305,35,57,12,104,75,89,201,187,35,57,312,12,104,75,89,201,187]
		// },
		// keys:
		// {
		// 	value: ['date', 'index_co']
		// },
		names:
		{
			index_co: 'Previous CO AQI'
		},
		color: function(color, d)
		{
			return (d.value < 51)? '#4ce600' : (d.value < 101)? '#fff71a' : (d.value < 151)? '#ff7e00' : (d.value < 201)? '#ff0000' : (d.value < 301)? '#8f3f97' : (d.value > 300)? '#7e0023' : '#009999';
		},
		x: 'date',
		type: 'bar'
	},
	bar:
	{
		width:
		{
			ratio: 0.9
		}
	},
	axis:
	{
		y:
		{
			show: false
		},
		x:
		{
			show: false,
			type: 'category',
		}
	},
	legend:
	{
		show: false
	},
	size:
	{
		height: 80
	}
});

console.log(aqi_bar_co.data('date'));

var aqi_bar_no2 = c3.generate(
{
	bindto: '#aqi-bar-no2',
	data:
	{
		json:
		{
			date      : aqi_prev_date,
			index_no2 : aqi_prev_no2
		},
		// {
		// 	CO: [35,57,12,104,75,89,201,187,305,35,57,12,104,75,89,201,187,35,57,312,12,104,75,89,201,187]
		// },
		// keys:
		// {
		// 	value: ['date', 'index_no2']
		// },
		names:
		{
			index_no2: 'Previous NO2 AQI'
		},
		color: function(color, d)
		{
			return (d.value < 51)? '#4ce600' : (d.value < 101)? '#fff71a' : (d.value < 151)? '#ff7e00' : (d.value < 201)? '#ff0000' : (d.value < 301)? '#8f3f97' : (d.value > 300)? '#7e0023' : '#009999';
		},
		x: 'date',
		type: 'bar'
	},
	bar:
	{
		width:
		{
			ratio: 0.9
		}
	},
	axis:
	{
		y:
		{
			show: false
		},
		x:
		{
			show: false,
			type: 'category'
		}
	},
	legend:
	{
		show: false
	},
	size:
	{
		height: 80
	}
});


// window.setInterval(function()
// {
// 	aqi_co_val = Math.round((Math.random()*500));
// 	aqi_no2_val = Math.round((Math.random()*500));

// 	AQI_Generate(aqi_co_val, aqi_no2_val);

// 	aqi_gauge_co.load(
// 	{
// 		json:
// 		{
// 			co: aqi_co_val
// 		}
// 	});
// 	aqi_gauge_no2.load(
// 	{
// 		json:
// 		{
// 			no2: aqi_no2_val
// 		}
// 	});
// }, 2000);