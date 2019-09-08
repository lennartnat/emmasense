function fillZero(d)
{
	if(d < 10)
	{
		return '0'+d;
	}
	else
	{
		return d;
	}
}

module.exports = 
{
	getDate: function(date, w_fullYear)
	{
		if(date == null)
			date = new Date();

		if(w_fullYear == true)
			dt_date = fillZero((date.getMonth()+1)) + '/' + fillZero(date.getDate()) + '/' + date.getFullYear();
		else
			dt_date = fillZero((date.getMonth()+1)) + '/' + fillZero(date.getDate()) + '/' + String(date.getFullYear()).substr(2);

		return dt_date
	},

	getTime: function(date, w_secs)
	{
		if(date == null)
			date = new Date();

		dt_time = fillZero(date.getHours()) + ':' + fillZero(date.getMinutes());

		if(w_secs == true)
			dt_time += ':' + fillZero(date.getSeconds());

		return dt_time;
	},

	generateTimestamp(date)
	{
		var timestamp;

		if(date == null)
			date = new Date();

		timestamp = fillZero(date.getMonth()+1) + '-' + fillZero(date.getDate()) + '-' + date.getFullYear() + '_'
		timestamp += fillZero(date.getHours()) + '-' + fillZero(date.getMinutes()) + '-' + fillZero(date.getSeconds());

		return timestamp;
	}
}