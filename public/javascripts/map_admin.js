// http://maps.googleapis.com/maps/api/geocode/json?latlng=10.35319098694343,123.913351893425&sensor=true

var emmaApp = angular.module('emmaApp', []);

var lat = 10.3363829,
	lng = 123.9066572;

var map = L.map('map-sensor').setView([lat, lng], 13);
L.tileLayer('http://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png',
{
	maxZoom: 19
}).addTo(map);

for(i in device_locations)
{
	var marker = L.marker([device_locations[i].latitude, device_locations[i].longitude]).addTo(map);
	marker.bindPopup("<a href='/sensor/" + device_locations[i].identification + "'>" + device_locations[i].identification + "</a>");
}


emmaApp.controller('EmmaController', function EmmaController($scope, $http)
{
	$('#ajax-spinner').hide();
	map.on('click', function(m)
	{
		$('#ajax-spinner').show();
		
		var lat = m.latlng.lat,
			lng = m.latlng.lng;

		circle = L.circle([lat, lng],
		{
			color: '#00e6e6',
			radius: 100
		}).addTo(map);

		$http.get('http://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + lng + '&sensor=true').then(function(res)
		{
			var address = res.data.results[0].formatted_address;
			var latitude = res.data.results[0].geometry.location.lat;
			var longitude = res.data.results[0].geometry.location.lng;

			$scope.address = address;
			$scope.latitude = latitude;
			$scope.longitude = longitude;

			L.popup().setLatLng(m.latlng).setContent(address).openOn(map);

			$('#ajax-spinner').hide();
		});
	});
});