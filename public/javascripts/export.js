$('#export-btn').click(function()
{
	$('#modal-export').modal();
});

$('#export-date-picker').dateRangePicker(
{
	format: 'MM-DD-YY HH:mm',
	startDate: (new Date(sdata[0].date)),
	endDate: getEndDate(),
	time:
	{
		enabled: true
	},
	swapTime: false,
	selectForward: true,
	singleMonth: 'auto',
	inline: true,
	container: '#export-date-picker-div',
	autoClose: true,
	alwaysOpen: true
});

function getEndDate()
{
	dt = new Date();
	date_now =  fillZero((dt.getMonth()+1)) + '-' + fillZero(dt.getDate()) + '-' + (String(dt.getFullYear())).substr(2);
	return (date_now) + ' ' + '23:59';
}