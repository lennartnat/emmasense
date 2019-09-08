$('#login-btn').click(function()
{
	$('#modal-login').modal();
	$('#alert-login-error').hide();
});

var emmaApp = angular.module('emmaApp', []);

emmaApp.controller('LoginController', function LoginController($scope, $http, $window)
{
	$('#signin-btn').click(function(e)
	{
		var loginData = {'username': $scope.uname, 'password': $scope.pword};

		$http.post('/users/login', loginData).then(function(res)
		{
			if(res.data.checkresult == 'none')
				$scope.error = 'Invalid identification.'
			else if(res.data.checkresult == 'bad')
				$scope.error = 'Incorrect passcode.'
			else
				$window.location.href='/admin'

			if(res.data.checkresult != 'good') $('#alert-login-error').show()
		});
	});
});