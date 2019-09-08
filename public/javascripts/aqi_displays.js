AQI_Disp();

emmaApp.controller('SerialController', function SerialController($scope, $http)
{
	$('#ajax-spinner').hide();

	$('.btn-show-sn').click(function(e)
	{
		$('#ajax-spinner').show();
		$('#modal-serial').modal();

		var a = $(this).data('a') - 1;

		$http.post('/admin/getSerial', { device_id: devices[a]._id }).then(function(result)
		{
			// $scope.deviceLocation = devices[a].identification;
			$('#ajax-spinner').hide();
			$scope.serialNumber   = result.data.serialNumber;
		});
	})
});

function AQI_Disp()
{
	console.log(devices);
	for(i in devices)
	{
		aqi_val     = devices[i].aqi? Math.max(devices[i].aqi.index_co, devices[i].aqi.index_no2) : 0;
		aqi_class   = AQI_GetClass(aqi_val);

		$('#badge'+i).addClass(aqi_class);
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