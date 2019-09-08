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

function getDateTime(date, mode)
{
	if(date == null)
		dt = new Date();
	else
		dt = new Date(date);

	if(mode == 0)
		dt_date = fillZero((dt.getMonth()+1)) + '/' + fillZero(dt.getDate()) + '/' + dt.getFullYear();
	else
		dt_date = fillZero((dt.getMonth()+1)) + '/' + fillZero(dt.getDate()) + '/' + String(dt.getFullYear()).substr(2);

	dt_time = fillZero(dt.getHours()) + ':' + fillZero(dt.getMinutes());

	dt_str = dt_date + ' ' + dt_time;
	return dt_str;
}

// module.exports =
// {
// 	fillZero: function(d)
// 	{
// 		if(d < 10)
// 		{
// 			return '0'+d;
// 		}
// 		else
// 		{
// 			return d;
// 		}
// 	}

// 	getDateTime()
// 	{
// 		dt = new Date();
// 		dt_date = fillZero((dt.getMonth()+1)) + '/' + fillZero(dt.getDate()) + '/' + dt.getFullYear();
// 		dt_time = fillZero(dt.getHours()) + ':' + fillZero(dt.getMinutes());
// 		dt_str = dt_date + ' ' + dt_time;
// 		return dt_str;
// 	}
// }