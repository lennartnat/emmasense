$(document).ready(function(e)
{
	var lat = 10.3363829,
		lng = 123.9066572;

	var map = L.map('map').setView([lat, lng], 13);
	L.tileLayer('http://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png',
	{
		maxZoom: 19
	}).addTo(map);

	var shadow_url = '/plugins/leaflet/images/marker-shadow.png';

	

	for(x in devices)
	{
		aqi = devices[x].aqi? Math.max(devices[x].aqi.index_co, devices[x].aqi.index_no2) : 0;
		// marker_url = getMarkerUrl(aqi);

		// marker_icon = L.icon(
		// {
		// 	iconUrl    : marker_url,
		// 	shadowUrl  : shadow_url,
		// 	iconAnchor : [12, 41]
		// });


		// marker = L.marker([devices[x].latitude, devices[x].longitude], {icon: marker_icon}).addTo(map);
		// marker.bindPopup("<a href='/sensor/" + devices[x].identification + "'>" + devices[x].address + "</a>");

		area = L.circle([devices[x].latitude, devices[x].longitude],
		{
			color       : getMarkerColor(aqi),
			fillColor   : getMarkerColor(aqi),
			fillOpacity : 0.6,
			radius      : 300
		}).addTo(map);
		area.bindPopup("<a href='/sensor/" + devices[x].identification + "'>" + devices[x].identification + "</a>");
	}

	function getMarkerColor(aqi)
	{
		if(aqi < 51)
		{
			return 'rgb(76, 230, 0)';
		}
		else if(aqi < 101)
		{
			return 'rgb(255, 247, 0)';
		}
		else if(aqi < 151)
		{
			return 'rgb(255, 126, 0)';
		}
		else if(aqi < 201)
		{
			return 'rgb(255,0,0)';
		}
		else if(aqi < 301)
		{
			return 'rgb(143,63,151)';
		}
		else
		{
			return 'rgb(126,0,35)';
		}
	}

	function getMarkerUrl(aqi)
	{
		var url = '/plugins/leaflet/images';
		if(aqi < 51)
		{
			url += '/marker-g.png';
		}
		else if(aqi < 101)
		{
			url += '/marker-y.png';
		}
		else if(aqi < 151)
		{
			url += '/marker-o.png';
		}
		else if(aqi < 201)
		{
			url += '/marker-r.png';
		}
		else if(aqi < 301)
		{
			url += '/marker-p.png';
		}
		else
		{
			url += '/marker-m.png';
		}

		return url;
	}
});
	