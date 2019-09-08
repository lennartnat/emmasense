var times = require('./times');

function create_CSV_Headers(titles)
{
	var headers = "";
	for(i in titles)
	{
		headers += titles[i] + ',';
	}
	headers += '\n';
	return headers;
}

function create_CSV_Data(data)
{
	var csv = "";
	for(i in data)
	{
		csv += times.getDate(data[i].date, true) + ',';
		csv += times.getTime(data[i].date, true) + ',';
		csv += data[i].co          + ',';
		csv += data[i].c6h6        + ',';
		csv += data[i].no2         + ',';
		csv += data[i].temperature + ',';
		csv += data[i].humidity    + ',';
		csv += data[i].pressure    + '\n';
	}
	return csv;
}

module.exports =
{
	toCSV: function(json_data)
	{
		csv_headers  = create_CSV_Headers(json_data.headers);
		csv_data     = create_CSV_Data(json_data.data);
		var data_csv = csv_headers + csv_data;

		return data_csv;
	}
}