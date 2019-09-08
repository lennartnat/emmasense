// mongod --dbpath "C:\Users\lenna\Documents\School\Thesis\06 CODE\Web\senseplot\db"

var express      = require('express');
var path         = require('path');
var favicon      = require('serve-favicon');
var logger       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var mongoose     = require('mongoose');
var session      = require('express-session');

var lm           = require('./models/device_model')();
var sm           = require('./models/sensor_model')();
var rm           = require('./models/serial_model')();
var um           = require('./models/user_model')();

var ser = require('./methods/serial');
var mw           = require('./middleware/user');

var index        = require('./routes/index');
var users        = require('./routes/users');
var admin        = require('./routes/admin');
var sensor       = require('./routes/sensor');

var app = express();

var mdb_url_local = 'mongodb://127.0.0.1/sensor';
var mdb_url_mlab  = 'mongodb://lennarto:lenn4rt@ds139567.mlab.com:39567/sensor';
mongoose.connect(mdb_url_mlab);



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// app.use(favicon(path.join(__dirname, 'public', 'images/logos', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Session
app.use(session(
{
	secret: 'emmasecret',
	resave: false,
	saveUninitialized: false
}));

// Socket.io
app.io = require('socket.io')();
var io = app.io;

app.use(function(req, res, next)
{
	req.io = io;
	res.locals.session = req.session;
	next();
});

app.use('/', index);
app.use('/users', users);
app.use('/admin', mw.authenticate, admin);
app.use('/sensor', sensor)

// catch 404 and forward to error handler
app.use(function(req, res, next)
{
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function(err, req, res, next)
{
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

/**
 * Web sockets here.
 */

var client_ctr = 0;

// Listen to client connection.
io.on('connection', function(socket)
{
	client_ctr++;
	console.log("A client has connected. #: " + client_ctr);

	socket.on('disconnect', function()
	{
		client_ctr--;
		console.log('A client disconnected. #: ' + client_ctr);
	});
});

module.exports = app;