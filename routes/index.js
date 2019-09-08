var express = require('express');
var router  = express.Router();

router.get('/', function(req, res, next)
{
	res.render('index',
	{
		title: 'EMMA'
	});
});

router.get('/sensors/:view', function(req, res, next)
{
	Device.find().then(function(data)
	{
		Device.populate(data, {path: 'aqi'}, function(err, data2)
		{
			res.render(req.params.view, 
			{
				title: 'EMMA | Deployments',
				devices: data2
			});
			
		})
		
	});
});

module.exports = router;
