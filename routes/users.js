var express = require('express');
var router  = express.Router();

router.post('/login', function(req, res, next)
{
	var username = req.body.username,
		password = req.body.password;

	Admin.findOne({username: username}).then(function(data)
	{
		if(data == null)
		{
			res.json({'checkresult': 'none'})
		}
		else
		{
			if(password == data.password)
			{
				req.session.username = username
				res.json({'checkresult': 'good'})
			}
			else
			{
				res.json({'checkresult': 'bad'})
			}
		}
	});
});

router.get('/logout', function(req, res, next)
{
	req.session.destroy(function(err)
	{
		if(err) console.log(err);
		else
		{
			console.log(req.session);
			res.redirect('/');
		}
	});
});

module.exports = router;
