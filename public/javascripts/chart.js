// var date	= [],
// 	co 		= [],
// 	c6h6 	= [],
// 	no2 	= [];

// console.log(sdata);

// $.each(sdata, function(err, dat)
// {
// 	var d = new Date(dat.date);
// 	date.push(new Date(dat.date));
// 	co.push(dat.co);
// 	c6h6.push(dat.c6h6);
// 	no2.push(dat.no2);
// });

$.each(sdata, function(i, dat)
{
	sdata[i].date = Date.parse(dat.date);
});

var chart = c3.generate(
{
    bindto: '#chart',
    data:
    {
	    json: sdata,
	    keys:
	    {
	    	value: ['date', 'co', 'c6h6', 'no2']
	    },
	    names:
	    {
	    	co: 'CO',
	    	c6h6: 'C6H6',
	    	no2: 'NOx'
	    },
	    colors:
	    {
	    	co 		: '#009999', // #009999
	    	c6h6 	: '#ff9933', // #e67300
	    	no2 	: '#993399'  // #993399
	    },
	    color: function(color, d)
	    {
	    	switch(d.id)
	    	{
	    		case 'co'	: return d.value >= 10.3 ? '#ff3333' : color;
	    		case 'c6h6'	: return d.value >= 7.8 ? '#ff3333' : color;
	    		case 'no2'	: return d.value >= 1.9 ? '#ff3333' : color;
	    	}
	    },

	    selection:
	    {
	    	enabled: false,
	    	draggable: false
	    },
	    x: 'date',
	    //xFormat: '%H:%M',
		type: 'area'
	},
	area:
	{
		zerobased: true
	},
	axis:
	{
		x:
		{
			type: 'timeseries',
			tick:
			{
				format : "%m/%d %H:%M",
				// format: function (date)
				// {
				// 	var format = fillZero(date.getMonth()) + '/' + fillZero(date.getDate()) + ' ' + fillZero(date.getHours()) + ':' + fillZero(date.getMinutes());
				// 	return format;
				// },
				count: 12,
				fit: false
			},
			label: 
			{
				text: 'Time',
				position: 'inner-right'
			}
		},
		y:
		{
			label: 
			{
				text: 'mg/m3'
			}
		}
	},
	grid:
	{
		y:
		{
			show: true,
			lines:
			[
				{value: 10.3, text: 'CO STEL', class: 'chart-stel-co'},
				{value: 7.8, text: 'C6H6 STEL', class: 'chart-stel-c6h6'},
				{value: 1.9, text: 'NO2 STEL', class: 'chart-stel-no2'}				
			]
		}
	},
	legend:
	{
		show: true,
		position:  'bottom'
	},
	tooltip:
	{
		show: true,
		grouped: false,
		// contents: function(d, defaultTitleFormat, defaultValueFormat, color)
		// {
		// 	return '<span>'+defaultValueFormat+'</span>';
		// }
	},
	size:
	{
		height: 430
	},
	padding:
	{
		// top: 20,
		// bottom: 10,
		// right: 10
	},
	zoom:
	{
		enabled: true,
		rescale: false
	},
	point:
	{
		r: 2.3,
		focus:
		{
			expand:
			{
				r: 7
			}
		}
	}
});

// d3.select('#chart').data(['CO','C6H6','NO2']).each(function(id)
// {
// 	d3.select(this).style('background-color', chart.color(id));
// });

// chart.data.colors({
//   CO: '#FEFEFE',
//   C6H6: '#000000',
//   NO2: function(color, d)
//   {
//   	if(d.index > 1)
//   	{
//   		return '#ff0000';
//   	}
//   	else
//   	{
//   		return color;
//   	}
//   }
// });