$('a[data-toggle="tab"]').on( 'shown.bs.tab', function (e)
{
    $.fn.dataTable.tables( {visible: true, api: true} ).columns.adjust().responsive.recalc();
});

console.log(sess);

var table = $('#table-fill').DataTable(
{
	data: sdata,
	columns:
	[
		{
			data: 'date',
			render: function(data, type, row)
			{
				var d = new Date(data),
					str = fillZero(d.getMonth()+1)+'/'+fillZero(d.getDate())+'/'+d.getFullYear();
				return str;
			},
			title: 'Date'
		},
		{
			data: 'date',
			render: function(data, type, row)
			{
				var d = new Date(data),
					str = fillZero(d.getHours())+':'+fillZero(d.getMinutes())+':'+fillZero(d.getSeconds());
				return str;
			},
			title: 'Time'
		},
		{
			data: 'co',
			title: 'CO'
		},
		{
			data: 'c6h6',
			title: 'C6H6'
		},
		{
			data: 'no2',
			title: 'NOx'
		},
		{
			data: 'temperature',
			title: 'Temp.'
		},
		{
			data: 'humidity',
			title: 'Hum.',
			orderable: false
		},
		{
			data: 'pressure',
			title: 'Press.',
			orderable: false
		},
		{
			data: '_id',
			render: function(data, type, row)
			{
				return '<a href=delete-data/'+data+'>Delete</a>';
			},
			title: 'Tool',
			orderable: false,
			visible: sess? true : false
		}
	],
	columnDefs:
	[
		{
			className: 'dt-center', 'targets': '_all'
		}
	],
	order:
	[
		[0, 'desc'], [1, 'desc']
	],
	pagingType: 'simple_numbers',
	paging: true,
	scrollY: 350,
	responsive: true,
	colReorder: true
});

$('#table-btn').click(function()
{
	setTimeout(function()
	{
		console.log('drawing table!!');
		table.draw();
	}, 1000);
})
