module.exports = 
{
	authenticate: function(req, res, next)
	{
		if(req.session.username)
			next()
		else
			res.sendStatus(401);
	}
}